const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.pdf':'application/pdf','.mp4':'video/mp4','.otf':'font/otf','.woff2':'font/woff2','.ttf':'font/ttf'};
http.createServer((req,res)=>{
  let relative;
  try{relative=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/preview-project(?=\/)/,'');}catch{res.writeHead(400).end();return;}
  if(relative.endsWith('/'))relative+='index.html';
  const file=path.resolve(root,'.'+relative);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}
  const size=fs.statSync(file).size;
  const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-store'};
  const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range||'');
  let start=0,end=size-1,status=200;
  if(match){
    if(match[1]){start=Number(match[1]);if(match[2])end=Math.min(end,Number(match[2]));}
    else if(match[2])start=Math.max(0,size-Number(match[2]));
    if(start>=size||end<start){res.writeHead(416,{'Content-Range':'bytes */'+size}).end();return;}
    status=206;headers['Content-Range']='bytes '+start+'-'+end+'/'+size;
  }
  headers['Content-Length']=end-start+1;
  res.writeHead(status,headers);
  if(req.method==='HEAD'){res.end();return;}
  fs.createReadStream(file,{start,end}).pipe(res);
}).listen(4173,'127.0.0.1',()=>process.stdout.write('Local preview: http://127.0.0.1:4173/preview-project/\n'));
