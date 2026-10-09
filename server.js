/** WAVELELA — Node 20+ HTTPS-ready static server + real transactional email API.
 * Public files never contain email credentials. Run behind HTTPS in production.
 */
import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const ROOT=fileURLToPath(new URL('.',import.meta.url));
const PORT=Number(process.env.PORT||3000), MAX_BODY=16000;
const MAIL_TO='comercial@wavelela.ao'; // Fixed corporate recipient: never supplied by the browser
const services={ship:'Ship Chandling',crew:'Crew Change',log:'Suporte Logístico',other:'Outro serviço / produto'};
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8'};
const accepted=new Map(); const active=new Set(); const hits=new Map();
const allowedOrigins=(process.env.QUOTE_ALLOWED_ORIGINS||'').split(',').map(x=>x.trim()).filter(Boolean);
const json=(res,status,body,headers={})=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...headers});res.end(JSON.stringify(body));};
const clean=(v,max=200)=>typeof v==='string'?v.trim().slice(0,max).replace(/[\u0000-\u001f\u007f]+/g,' '):'';
const emailValid=v=>typeof v==='string' && v.length<=160 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(v);
const escapeHTML=s=>String(s||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const uuidValid=v=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
const VALID_PHONE=/^[+\d\s().-]{0,40}$/;
function validate(raw){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
  const d={requestId:raw.requestId,submittedAt:raw.submittedAt,requesterType:clean(raw.requesterType,20),company:clean(raw.company,120),name:clean(raw.name,100),email:clean(raw.email,160),phone:clean(raw.phone,40),service:clean(raw.service,30),otherService:clean(raw.otherService,180),details:typeof raw.details==='string'?raw.details.trim():'',port:clean(raw.port,180),vessel:clean(raw.vessel,120),eta:clean(raw.eta,32),deadline:clean(raw.deadline,32),consent:raw.consent,website:raw.website};
  if(!uuidValid(d.requestId)||!['business','individual'].includes(d.requesterType)||d.name.length<2||!emailValid(d.email)||!(d.service in services)||d.details.length<10||d.details.length>3000||d.consent!=='on')return null;
  if(d.requesterType==='business'&&d.company.length<2)return null;
  if(d.service==='other'&&d.otherService.length<3)return null;
  if(!VALID_PHONE.test(d.phone))return null;
  if(d.eta&&!/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(d.eta))return null;
  if(d.deadline&&!/^\d{4}-\d\d-\d\d$/.test(d.deadline))return null;
  const date=new Date(d.submittedAt);
  if(typeof d.submittedAt!=='string'||!Number.isFinite(date.getTime())||date.getTime()>Date.now()+5*60000||date.getTime()<Date.now()-24*3600000)return null;
  d.submittedAt=date.toISOString(); d.details=d.details.slice(0,3000).replace(/\r/g,'');
  return d;
}
function mailContent(d){
 const service=d.service==='other'?d.otherService:services[d.service];
 const sender=d.requesterType==='business'?d.company:d.name;
 const subject=`Pedido de Cotação | ${clean(service,80)} | ${clean(sender,100)}`;
 const submitted=new Intl.DateTimeFormat('pt-PT',{timeZone:'Africa/Luanda',dateStyle:'full',timeStyle:'short'}).format(new Date(d.submittedAt));
 const fields=[['Tipo de solicitante',d.requesterType==='business'?'Empresa / entidade':'Particular'],['Empresa / entidade',d.requesterType==='business'?d.company:'Não aplicável'],['Pessoa de contacto',d.name],['E-mail',d.email],['Telefone',d.phone||'Não indicado'],['Serviço / produto',service],['Local / porto',d.port||'Não indicado'],['Navio',d.vessel||'Não indicado'],['ETA previsto',d.eta||'Não indicado'],['Prazo pretendido',d.deadline||'Não indicado'],['Descrição, quantidades e especificações',d.details],['Data da submissão (hora de Luanda)',submitted],['Referência do pedido',d.requestId]];
 const intro='A WAVELELA recebeu, através do website corporativo, o seguinte pedido de cotação para apreciação pela equipa comercial.';
 const text=`WAVELELA | NOVO PEDIDO DE COTAÇÃO\n\n${intro}\n\n${fields.map(([k,v])=>`${k}: ${v}`).join('\n\n')}\n\nPara responder ao solicitante, utilize a função Responder deste e-mail.`;
 const rows=fields.map(([key,value])=>`<tr><th style="padding:12px 15px;text-align:left;border-bottom:1px solid #e3e9ea;width:37%;vertical-align:top;color:#30465a;font-weight:600">${escapeHTML(key)}</th><td style="padding:12px 15px;border-bottom:1px solid #e3e9ea;white-space:pre-wrap;overflow-wrap:anywhere;color:#182d3b">${escapeHTML(value)}</td></tr>`).join('');
 const html=`<!doctype html><html lang="pt"><head><meta charset="utf-8"></head><body style="margin:0;background:#f2f4f5;padding:24px;font-family:Arial,sans-serif"><div style="max-width:720px;margin:auto;background:#fff;border-radius:8px;overflow:hidden"><div style="background:#0e2335;padding:25px 30px;color:#e5c881"><div style="font-size:23px;letter-spacing:1px;font-weight:bold">WAVELELA</div><div style="font-size:12px;margin-top:6px">PEDIDO DE COTAÇÃO RECEBIDO</div></div><div style="padding:24px 26px"><h2 style="font-size:21px;color:#112638;margin-top:0">Novo pedido comercial</h2><p style="font-size:14px;line-height:1.65;color:#354857">${escapeHTML(intro)}</p><table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table><p style="font-size:13px;line-height:1.6;color:#40596b">Responda directamente a esta mensagem para contactar o solicitante.</p></div><div style="background:#f7f6f2;padding:15px 26px;color:#60707b;font-size:12px">WAVELELA · Logística & Suporte · Angola</div></div></body></html>`;
 return {service,subject,html,text};
}
function cors(req,res){
 const origin=req.headers.origin;
 if(!origin)return true; // non-browser clients are still rate-limited and validated
 let allowed=false;
 try{const o=new URL(origin),host=req.headers.host||''; allowed=(o.host===host)||(allowedOrigins.includes(o.origin));}catch{}
 if(!allowed)return false;
 res.setHeader('Access-Control-Allow-Origin',origin);
 res.setHeader('Vary','Origin');
 res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
 res.setHeader('Access-Control-Allow-Headers','Content-Type');
 return true;
}
function rateLimited(ip){
 const now=Date.now(),period=3600000;
 for(const [id,row] of hits)if(row.length===0||row[row.length-1]<now-period)hits.delete(id);
 const recent=(hits.get(ip)||[]).filter(v=>now-v<period);
 if(recent.length>=8)return true;
 recent.push(now);hits.set(ip,recent);return false;
}
async function api(req,res){
 if(!cors(req,res))return json(res,403,{message:'Origem não autorizada.'});
 if(req.method==='OPTIONS'){res.writeHead(204);return res.end();}
 if(req.method!=='POST')return json(res,405,{message:'Método não permitido.'});
 if(!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type']||''))return json(res,415,{message:'Formato de pedido não suportado.'});
 const ip=req.socket.remoteAddress||'unknown';
 if(rateLimited(ip))return json(res,429,{message:'Demasiadas tentativas. Aguarde antes de tentar novamente.'});
 let chunks=[],size=0;
 try{for await(const chunk of req){size+=chunk.length;if(size>MAX_BODY)return json(res,413,{message:'Pedido demasiado grande.'});chunks.push(chunk)}}catch{return json(res,400,{message:'Pedido incompleto.'})}
 let raw;try{raw=JSON.parse(Buffer.concat(chunks).toString('utf8'))}catch{return json(res,400,{message:'O pedido contém dados inválidos.'})}
 // Honeypot never sends a message; no success confirmation is given to honest users.
 if(raw?.website)return json(res,422,{message:'Não foi possível processar o formulário.'});
 const d=validate(raw);
 if(!d)return json(res,422,{message:'Verifique os campos obrigatórios, o serviço e os detalhes do pedido.'});
 if(!process.env.RESEND_API_KEY||!process.env.MAIL_FROM)return json(res,503,{message:'O envio automático ainda não foi activado. Tente novamente mais tarde ou contacte comercial@wavelela.ao.'});
 const hash=createHash('sha256').update(JSON.stringify(d)).digest('hex');
 const prior=accepted.get(d.requestId);
 if(prior){if(prior.hash!==hash)return json(res,409,{message:'O pedido foi alterado. Volte a submeter para gerar uma nova referência.'});return json(res,200,{ok:true,reference:d.requestId,providerAccepted:true,duplicate:true});}
 if(active.has(d.requestId))return json(res,409,{message:'Este pedido está a ser processado. Aguarde antes de repetir.'});
 active.add(d.requestId);
 try{
  const email=mailContent(d);
  const providerUrl=process.env.NODE_ENV==='test'&&process.env.RESEND_TEST_ENDPOINT?process.env.RESEND_TEST_ENDPOINT:'https://api.resend.com/emails';
  const upstream=await fetch(providerUrl,{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':d.requestId},body:JSON.stringify({from:process.env.MAIL_FROM,to:[MAIL_TO],reply_to:d.email,subject:email.subject,text:email.text,html:email.html}),signal:AbortSignal.timeout(12000)});
  if(!upstream.ok){console.error('WAVELELA email provider status',upstream.status);return json(res,502,{message:'O serviço de envio não aceitou o pedido. Os dados foram preservados; tente novamente.'});}
  const confirmation=await upstream.json().catch(()=>null);
  if(!confirmation||typeof confirmation.id!=='string'){console.error('Provider missing confirmation id');return json(res,502,{message:'Não foi possível confirmar a aceitação pelo serviço de e-mail. Não volte a enviar imediatamente; confirme o estado do pedido com a WAVELELA.'});}
  accepted.set(d.requestId,{hash,id:confirmation.id,when:Date.now()});
  for(const [id,row] of accepted)if(row.when<Date.now()-24*3600000)accepted.delete(id);
  return json(res,200,{ok:true,reference:d.requestId,providerAccepted:true,message:'Pedido aceite pelo serviço de e-mail.'});
 }catch(e){console.error('WAVELELA delivery exception',e.name);return json(res,502,{message:'Não foi possível confirmar o envio. Os seus dados foram mantidos; antes de tentar novamente, confirme se o pedido foi recebido.'});}
 finally{active.delete(d.requestId);}
}
async function serveStatic(req,res,u){
 if(!['GET','HEAD'].includes(req.method))return json(res,405,{message:'Método não permitido.'});
 let rel;try{rel=decodeURIComponent(u.pathname).replace(/^\/+/, '')||'index.html'}catch{return json(res,400,{message:'Caminho inválido'})}
 if(rel.endsWith('/'))rel+='index.html';
 const file=resolve(ROOT,rel);
 const hidden=rel.split('/').some(s=>s.startsWith('.'));
 const allowed=/^(?:assets\/[\w-]+\.(?:png|webp|svg)|(?:index|contacto|empresa|servicos|crew-change|ship-chandling|suporte-logistico|privacidade|404)\.html|(?:app|styles|config)\.(?:js|css)|robots\.txt)$/;
 if(hidden||!file.startsWith(ROOT)||file.includes(`${sep}.`)||!allowed.test(rel))return json(res,404,{message:'Ficheiro não disponível'});
 let data;try{if(!(await stat(file)).isFile())throw Error('not found');data=await readFile(file)}catch{res.writeHead(404,{'content-type':'text/html; charset=utf-8'});return res.end(await readFile(resolve(ROOT,'404.html')))}
 res.writeHead(200,{'content-type':MIME[extname(file)]||'application/octet-stream','x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin','x-frame-options':'DENY','permissions-policy':'camera=(), microphone=(), geolocation=()','cache-control':extname(file)==='.html'?'no-cache':'public, max-age=86400'});
 return res.end(req.method==='HEAD'?undefined:data);
}
const server=http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost');if(u.pathname==='/api/contact')return await api(req,res);return await serveStatic(req,res,u);}catch(e){console.error('WAVELELA server error',e);return json(res,500,{message:'Erro interno do servidor'})}});
server.listen(PORT,()=>console.log(`WAVELELA ready at http://localhost:${PORT}`));
