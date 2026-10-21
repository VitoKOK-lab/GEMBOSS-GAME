const Game = (() => {
'use strict';
const histories=[
{date:'2020-03-11',title:'WHO 宣布 COVID-19 為全球大流行',body:'公共衛生與跨境經營環境改變。公司可以評估線上直播；這是公司的轉型選擇，不代表直播在這一年才發明。',url:'https://www.who.int/europe/emergencies/situations/covid-19'},
{date:'2021-04-26',title:'iOS 14.5 的 App Tracking Transparency',body:'跨 App 追蹤需要使用者授權。遊戲會模擬投放歸因與獲客難度變化，具體幅度是遊戲假設。',url:'https://developer.apple.com/app-store/user-privacy-and-data-use/'},
{date:'2021-05-19',title:'台灣全國提升至第三級疫情警戒',body:'實體接觸受到限制。遊戲中的線下活動暫停，線上需求與履約壓力改變。',url:'https://www.cdc.gov.tw/Bulletin/Detail/abDtRS-xzztQeAchjX9fqw?typeid=9'},
{date:'2021-07-27',title:'台灣疫情警戒調降為第二級',body:'三級警戒結束，但不代表疫情或所有限制消失。遊戲恢復部分線下需求。',url:'https://www.cdc.gov.tw/En/Category/ListContent/EmXemht4IT-IRAPrAnyG9A?uaid=B-q5olcKuBQQnVdUhEJyng'},
{date:'2022-02-22',title:'Facebook Reels 擴展至全球',body:'Meta 宣布 Facebook Reels 全球推出。公司此時開放短影音轉型企劃；TikTok 在這之前已存在，這不是 TikTok 的發明日期。',url:'https://about.fb.com/news/2022/02/launching-facebook-reels-globally/'},
{date:'2023-05-05',title:'WHO 結束 COVID-19 國際關注公衛緊急事件',body:'緊急狀態結束並不等於病毒消失。公司進入重新配置線上與實體經營的階段。',url:'https://www.who.int/europe/emergencies/situations/covid-19'}
,{date:'2022-03-16',title:'美國聯準會開始升息循環',body:'聯準會將聯邦基金利率目標區間上調 0.25 個百分點。遊戲以消費信心與融資成本作為情境推演，並非珠寶業的歷史實測效果。',url:'https://www.federalreserve.gov/newsevents/pressreleases/monetary20220316a.htm'}
,{date:'2024-04-03',title:'花蓮近海強震',body:'中央氣象署記錄到規模 7.2 地震。遊戲推演短期物流與服務安排可能受影響，實際公司營運影響依位置而異。',url:'https://scweb.cwa.gov.tw/webdata/PDF/Reports/MOTC-CWA-113-E-01.pdf'}
];
const newsEvents=[
 {id:'covid-world',date:'2020-03-11',scope:'國際',title:'WHO 將 COVID-19 描述為全球大流行',detail:'WHO 於 2020 年 3 月 11 日表示，COVID-19 可被描述為全球大流行。',game:'遊戲推演：線上需求與直播觸及上升，實體客流和跨境履約承壓。衝擊會持續數週。',source:'https://www.who.int/news-room/speeches/item/who-director-general-s-opening-remarks-at-the-media-briefing-on-covid-19---11-march-2020',art:'crisis',duration:8,mods:{onlineDemand:1.12,liveReach:1.18,offlineDemand:.82,shippingCost:1.08},choices:[['pivot','投入線上服務與直播準備',80000,{onlineDemand:1.07,liveReach:1.12}],['stock','提高常用品備貨',120000,{shippingCost:.92}],['wait','保留現金，先觀察',0,{}]]},
 {id:'apple-att',date:'2021-04-26',scope:'國際・平台',title:'Apple App Tracking Transparency 開始適用',detail:'Apple 公告自 iOS 14.5 公開推出起，App 須使用 App Tracking Transparency 徵求追蹤許可。',game:'遊戲推演：廣告歸因更不完整，素材測試與熟客經營的相對價值提高。',source:'https://developer.apple.com/news/?id=ecvrtzt2',art:'campaign',duration:10,mods:{adEfficiency:.78},choices:[['crm','整理熟客名單與回購流程',60000,{adEfficiency:1.12,retention:1.12}],['creative','提高素材測試預算',80000,{adEfficiency:1.2}],['hold','維持目前投放方式',0,{}]]},
 {id:'taiwan-level3',date:'2021-05-19',scope:'台灣',title:'台灣全國疫情警戒提升至第三級',detail:'台灣 CDC 公布自 5 月 19 日起提升全國疫情警戒至第三級，並加強限制措施。',game:'遊戲推演：線下活動受限、線上詢問增加；遠距服務安排會影響客服負荷。',source:'https://www.cdc.gov.tw/Bulletin/Detail/abDtRS-xzztQeAchjX9fqw?typeid=9',art:'crisis',duration:10,mods:{offlineDemand:.58,onlineDemand:1.1,shippingCost:1.04},choices:[['remote','改以線上說明與遠距服務',35000,{onlineDemand:1.08,liveReach:1.08}],['cancel','暫停線下活動，保留人力',0,{consumerConfidence:1.02}],['normal','照原計畫安排活動',20000,{morale:.97}]]},
 {id:'taiwan-level2',date:'2021-07-27',scope:'台灣',title:'疫情警戒調降至第二級，邊境仍嚴管',detail:'台灣 CDC 公布自 7 月 27 日起調降警戒至第二級，同時持續執行邊境管制。',game:'遊戲推演：本地消費逐步回溫，但跨境交貨仍可能延誤。',source:'https://www.cdc.gov.tw/En/Bulletin/Detail/5ZsxT1aq_51sBtxTCdwp8w?typeid=158',art:'offer',duration:6,mods:{offlineDemand:1.24,shippingCost:1.04},choices:[['small-event','辦小型體驗活動',50000,{offlineDemand:1.12,consumerConfidence:1.04}],['online','維持線上為主',0,{onlineDemand:1.04}],['stock','提早確認跨境貨況',25000,{shippingCost:.94}]]},
 {id:'fed-rates',date:'2022-03-16',scope:'國際・經濟',title:'美國聯準會上調聯邦基金利率',detail:'美國聯準會於 2022 年 3 月 16 日宣布將聯邦基金利率目標區間提高 0.25 個百分點。',game:'遊戲推演：大額非必要消費轉謹慎，融資成本與現金週轉更值得留意。',source:'https://www.federalreserve.gov/newsevents/pressreleases/monetary20220316a.htm',art:'merger',duration:8,mods:{consumerConfidence:.95,adEfficiency:.96},choices:[['retention','優先服務熟客與既有訂單',30000,{retention:1.1,consumerConfidence:1.04}],['margin','縮減低效投放，保住毛利',0,{adEfficiency:1.06}],['expand','維持原擴張速度',50000,{consumerConfidence:.97}]]},
 {id:'facebook-reels',date:'2022-02-22',scope:'國際・平台',title:'Facebook Reels 擴展至全球 150 多個國家',detail:'Meta 宣布將 Facebook Reels 擴展至全球 150 多個國家，並增加創作者工具。',game:'遊戲推演：短影音觸及出現新機會，平台競爭也會升高；TikTok 並非此時才出現。',source:'https://about.fb.com/news/2022/02/launching-facebook-reels-globally/',art:'campaign',duration:8,mods:{shortVideoReach:1.2,adEfficiency:.96},choices:[['test-video','小額測試短影音內容',70000,{shortVideoReach:1.16}],['repurpose','重剪既有素材試水溫',25000,{shortVideoReach:1.08}],['wait','先觀察同業反應',0,{}]]},
 {id:'covid-emergency-end',date:'2023-05-05',scope:'國際',title:'WHO 結束 COVID-19 國際關注公衛緊急事件',detail:'WHO 宣布 COVID-19 不再構成國際關注公共衛生緊急事件，同時指出疫情仍是持續的健康議題。',game:'遊戲推演：線下需求有機會回升，但不能假設風險與服務需求立即消失。',source:'https://www.who.int/news/item/05-05-2023-statement-on-the-fifteenth-meeting-of-the-international-health-regulations-(2005)-emergency-committee-regarding-the-coronavirus-disease-(covid-19)-pandemic',art:'offer',duration:8,mods:{offlineDemand:1.16,consumerConfidence:1.04},choices:[['event','小規模恢復體驗活動',60000,{offlineDemand:1.1,consumerConfidence:1.05}],['hybrid','保留線上與線下雙軌',25000,{onlineDemand:1.04,offlineDemand:1.06}],['online','繼續以線上服務為主',0,{onlineDemand:1.05}]]},
 {id:'hualien-quake',date:'2024-04-03',scope:'台灣',title:'花蓮近海發生規模 7.2 強震',detail:'中央氣象署資料記錄，2024 年 4 月 3 日花蓮近海發生規模 7.2 地震。',game:'遊戲推演：短期物流查詢、出勤與客戶溝通成本上升；不代表各地公司都會停工。',source:'https://scweb.cwa.gov.tw/webdata/PDF/Reports/MOTC-CWA-113-E-01.pdf',art:'crisis',duration:3,mods:{shippingCost:1.1,consumerConfidence:.98},choices:[['care','先確認員工安全並主動通知客人',30000,{consumerConfidence:1.08}],['reschedule','調整交期並保留現金',0,{shippingCost:.96}],['rush','付費急件維持原交期',60000,{shippingCost:.94}]]}
];
const VERSION=2,WEEK_MS=180000,DAY_MS=WEEK_MS/5,WORKDAY_MS=33000;
const chapters=[
 {name:'從一張訂單開始',theme:'新創・FB 粉專',date:'2019-01-07',weeks:12,target:6000000,art:'gems',intro:'三位創始夥伴，五百萬資金。用選品、內容與服務建立第一批熟客。',base:1},
 {name:'隔著螢幕的生意',theme:'COVID-19・直播機會',date:'2020-03-16',weeks:12,target:9000000,art:'campaign',intro:'疫情改變消費與供應。直播是新機會，是否投入，由你決定。',base:1.18},
 {name:'青田街的新門牌',theme:'台北・代理團隊',date:'2021-04-12',weeks:16,target:12000000,art:'offer',intro:'擴張到台北的公司情境。代理、授權與團隊合作開始考驗管理。',base:1.3},
 {name:'被看見的時代',theme:'短影音・內容紅利',date:'2022-02-14',weeks:16,target:18000000,art:'campaign',intro:'短影音成為獲客選項。內容產量、轉單與人才依賴需要一起考慮。',base:1.5},
 {name:'流量也有成本',theme:'電商・廣告投放',date:'2023-05-01',weeks:20,target:25000000,art:'campaign',intro:'獲客不再免費。經營素材、轉換與利潤，並決定是否招募 HR。',base:1.65},
 {name:'另一種光芒',theme:'水晶・療癒新賽道',date:'2024-01-08',weeks:20,target:32000000,art:'gems',intro:'新客群帶來機會，也可能稀釋品牌。水晶是選項，不是唯一答案。',base:1.85},
 {name:'讓公司走得更遠',theme:'併購・上市',date:'2025-01-06',weeks:24,target:45000000,art:'merger',intro:'收購一家互補公司，完成整合與財務治理，再接受遊戲中的上市審查。',base:2.1}
];
const skills={select:'選品',marketing:'行銷',ops:'營運',people:'人才',finance:'財務'};
const card=(id,name,cat,cost,load,duration,skill,art,desc,effect,min=0)=>({id,name,cat,cost,load,duration,skill,art,desc,effect,min});
const cards=[
 card('select','精選主打彩寶','商品',30000,25,1,'select','gems','確認色澤、品質與主打客群，為內容與銷售打底。',.12),
 card('post','粉專商品故事','行銷',20000,24,1,'marketing','campaign','把商品價值說清楚。需要選品配合，詢問也會增加。',.14),
 card('loyal','熟客私訊','行銷',10000,22,1,'marketing','marketing','聯繫適合的熟客，重視回覆品質而非大量洗訊息。',.11),
 card('sale','限時促銷','行銷',35000,34,1,'marketing','gems','增加成交機會，也可能壓低毛利、提高客服負荷。',.20),
 card('quality','商品品質檢查','商品',25000,24,1,'select','crisis','核對商品規格與交貨品質，減少退貨與信任損失。',.045),
 card('premium','精品商品企劃','商品',120000,27,3,'select','gems','跨三週建立高價商品組合；完成後累積常態業務。',.07),
 card('hire','招募新同事','人員',0,28,1,'people','hr','提供三位候選人，錄用後下週到職並適應一週。',0),
 card('train','專業培訓','人員',30000,24,1,'people','training','提供學習機會。完成課程不代表能運用，成長不保證。',0),
 card('assess','實作考核','人員',0,24,1,'people','training','觀察作品、速度與錯誤，可由內部人員或付費顧問評估。',0),
 card('pip','四週改善計畫','人員',15000,22,1,'people','hr','啟動占一格；之後維持原工作，由負責人追蹤四週。',0),
 card('process','整理出貨流程','管理',20000,23,1,'ops','assistant','建立檢核與交接，提升履約能力、降低人員負擔。',.055),
 card('authority','授權與合約檢視','管理',25000,23,1,'finance','offer','整理合作權限與合約紀錄，降低資訊不完整的風險。',.025),
 card('live','建立直播能力','行銷',220000,38,3,'marketing','campaign','建立設備、講解與場控，完成後開放常態直播。',.10,1),
 card('agency','代理合作企劃','管理',250000,35,3,'finance','offer','試辦代理合作。授權與利益分配需要管理。',.09,2),
 card('video','短影音內容組','行銷',180000,34,3,'marketing','campaign','建立腳本、拍攝與剪輯流程，內容不保證直接成交。',.10,3),
 card('ads','廣告素材測試','行銷',80000,31,1,'marketing','campaign','比較素材與受眾，提高觸及，同時增加獲客支出。',.24,4),
 card('crystal','水晶商品線','商品',240000,32,3,'select','gems','試辦新客群與商品組合，訂單增加但單價與成本結構不同。',.12,5),
 card('course','線上知識課程','商品',250000,34,3,'select','training','把專業整理成課程，完成後成為常態收入來源。',.10,5),
 card('diligence','併購盡職調查','管理',180000,35,2,'finance','merger','整理收購對象的業務、團隊與財務資料。',0,6),
 card('acquire','收購合作公司','管理',1500000,42,3,'finance','merger','需要先完成盡職調查。以現金收購互補的珠寶業務。',.08,6),
 card('integrate','團隊與業務整合','管理',350000,40,3,'people','merger','收購後統一流程、交接客戶與保留關鍵人才。',.09,6),
 card('governance','財務治理準備','管理',300000,35,3,'finance','merger','建立董事會報告與財務管理，準備遊戲上市審查。',.03,6),
 card('listing','上市準備審查','管理',500000,40,2,'finance','merger','完成整合及治理後啟動；需獲利、現金及團隊穩定。',0,6),
 card('opportunity','限時供應商選品','商品',90000,32,1,'select','offer','本週的限時機會，與既有主打商品配合才容易消化。',.17)
];
const byId=Object.fromEntries(cards.map(c=>[c.id,c]));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function rand(s){s.seed=(Math.imul(1664525,s.seed)+1013904223)>>>0;return s.seed/4294967296;}
function copy(o){return JSON.parse(JSON.stringify(o));}
function date(s){return new Date(Date.parse(chapters[s.chapter].date+'T00:00:00Z')+s.week*7*86400000).toISOString().slice(0,10);}
function person(s,id,name,role,art,values){return {id,name,role,art,skills:values,energy:88,morale:78,salary:45000,adapt:0,records:[],training:null,pip:null,exitReady:false,hidden:{learn:rand(s),effort:rand(s),honesty:rand(s),bias:rand(s)}};}
function initial(seed=20190107){const s={v:VERSION,seed,chapter:0,week:0,totalWeek:0,cash:5000000,brand:65,morale:78,office:0,capabilities:{},guard:0,flow:0,equity:100,debt:0,chapterRevenue:0,chapterProfit:0,totalRevenue:0,month:[],reports:[],history:[],log:[],stageResults:[],plans:[],ongoing:[],phase:'planning',elapsed:0,run:null,revealIndex:0,candidates:[],arrivals:[],inquiries:[],notices:[],worldShocks:[],seenNews:[],newsLog:[],extended:false,tutorial:true,tab:'company',levelStart:null};s.staff=[person(s,'regina','Regina','創辦人・採購決策','regina',{select:82,marketing:62,ops:65,people:58,finance:65}),person(s,'founder-a','怡安','創始夥伴・行銷客服','marketing',{select:45,marketing:74,ops:58,people:52,finance:42}),person(s,'founder-b','若晴','創始夥伴・特助包貨','assistant',{select:48,marketing:46,ops:78,people:60,finance:52})];snapshot(s);return s;}
function snapshot(s){const q=copy(s);q.levelStart=null;s.levelStart=q;}
function log(s,text){s.log.unshift({date:date(s),text});s.log=s.log.slice(0,150);}
function available(s,c){if(s.chapter<c.min)return false;if(c.id==='opportunity')return s.totalWeek%3===0;if(c.id==='acquire')return !!s.capabilities.diligence;if(c.id==='integrate')return !!s.capabilities.acquire;if(c.id==='listing')return !!s.capabilities.integrate&&!!s.capabilities.governance;return true;}
function expense(s,n){s.cash-=n;s.chapterProfit-=n;if(s.run&&!s.run.settled)s.run.expenses+=n;else s.preExpenses=(s.preExpenses||0)+n;}
function shock(s,id,mods,weeks,label){s.worldShocks=s.worldShocks||[];s.worldShocks=s.worldShocks.filter(x=>x.id!==id);s.worldShocks.push({id,mods,left:weeks,label});}
function factor(s,key){return (s.worldShocks||[]).reduce((v,x)=>v*(x.mods[key]||1),1);}
function worldStatus(s){return {online:factor(s,'onlineDemand'),offline:factor(s,'offlineDemand'),confidence:factor(s,'consumerConfidence'),ads:factor(s,'adEfficiency'),video:factor(s,'shortVideoReach'),live:factor(s,'liveReach'),retention:factor(s,'retention'),shipping:factor(s,'shippingCost'),active:(s.worldShocks||[]).map(x=>({label:x.label,left:x.left}))};}
function marketTicker(s){const lines=[
 ['市場訊號','彩寶搜尋量略升，客人更常比較商品來源與證書。'],['客人留言','「有現貨的話，想先看自然光下的顏色和尺寸。」'],['市場訊號','近期高單價商品詢問增加，但下單決策時間拉長。'],['客人留言','「上次收到的包裝很用心，這次想找生日禮物。」'],['市場訊號','回覆速度與商品說明完整度，正在影響熟客回購。'],['客人留言','「可以先幫我確認這顆裸石能不能訂製成戒指嗎？」'],['市場訊號','短影音帶來新客，但留言詢問不一定會轉成訂單。'],['客人留言','「直播裡看到的顏色，跟室內燈下會差很多嗎？」']
 ];const i=(s.totalWeek*3+s.chapter*2+Math.floor(s.elapsed/16000))%lines.length;return {tag:lines[i][0],text:lines[i][1],simulated:true};}
function ticker(s){if(s.run?.ticker?.length){const i=Math.floor((s.elapsed||0)/8500)%s.run.ticker.length;return s.run.ticker[i];}return marketTicker(s);}
function newsEvent(n,at,index){return {id:'news-'+n.id,type:'news',storyId:n.id,at,index,speaker:null,bad:false,mislead:false,asked:[],evidence:[],answer:'',resolved:false,title:n.title,art:n.art,statement:n.detail,facts:[n.game],questions:[],choices:copy(n.choices),scope:n.scope,source:n.source,newsDate:n.date};}
function effective(p,key){const morale=Number.isFinite(p.morale)?p.morale:78;return p.skills[key]*(p.adapt? .72:1)*(.6+p.energy/250)*(.7+morale*.004);}
function workSchedule(s){const weekdays=['週一','週二','週三','週四','週五'];if(s.phase==='running'||s.phase==='event'){const t=clamp(s.elapsed||0,0,WEEK_MS),day=Math.min(4,Math.floor(t/DAY_MS)),local=t>=WEEK_MS?DAY_MS:t-day*DAY_MS,active=t<WEEK_MS,minutes=local>=WORKDAY_MS?19*60:600+Math.floor(local/WORKDAY_MS*540);return {day,weekday:weekdays[day],time:`${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`,action:!active?'off':local>=WORKDAY_MS?'clockout':local<2200?'clockin':'working',active,cycle:s.totalWeek*5+day};}if(s.phase==='reveal')return {day:4,weekday:'週五',time:'19:00',action:'off',active:false,cycle:s.totalWeek*5+4};return {day:0,weekday:'週一',time:'10:00',action:'idle',active:false,cycle:s.totalWeek*5};}
function employeeStatus(s,id,question='status'){
 const p=s.staff.find(x=>x.id===id);if(!p)return null;
 const shift=workSchedule(s),liveOrders=s.phase==='running'||s.phase==='event'?Math.floor((s.run?.forecast.orders||0)*clamp(s.elapsed/WEEK_MS,0,1)):0;
 const assigned=(s.plans||[]).filter(a=>a.person===id).map(a=>byId[a.card]?.name).filter(Boolean);
 const ongoing=(s.ongoing||[]).filter(a=>a.person===id).map(a=>byId[a.card]?.name).filter(Boolean);
 const role=p.role||'',morale=Math.round(p.morale??78),loadValue=load(s,id);
 let task,progress='';
 if(shift.action==='off')task='今天已下班，明天 10:00 再接著處理';
 else if(shift.action==='clockin')task='剛打卡，先整理今天的待辦';
 else if(shift.action==='clockout')task='正在收尾，核對今日待辦並準備打卡';
 else if(s.phase==='event')task=s.run?.current?'先停下手邊工作，等老闆處理突發事件':'暫停手邊工作，等老闆決策';
 else if(s.phase==='running'){
  if(assigned.length)task=`執行本週安排：${assigned.join('、')}`;
  else if(ongoing.length)task=`持續企劃：${ongoing.join('、')}`;
  else if(id==='regina'||role.includes('創辦人')||role.includes('採購'))task='挑選彩色裸石，核對色澤、預算與主打品項';
  else if(role.includes('行銷')||role.includes('客服'))task='回覆 FB 客人詢問，確認商品規格並追蹤訂單';
  else if(role.includes('特助')||role.includes('包裝')||role.includes('出貨'))task=liveOrders>18?'和同事一起核對訂單、包裝並貼寄件標籤':'核對訂單內容，包裝珠寶並準備出貨';
  else task='處理手上的日常工作，更新待辦進度';
  progress=`這週已過 ${Math.round(clamp(s.elapsed/WEEK_MS,0,1)*100)}%`;
 }else if(assigned.length)task=`本週預計負責：${assigned.join('、')}`;
 else if(ongoing.length)task=`持續企劃：${ongoing.join('、')}`;
 else if(id==='regina'||role.includes('創辦人')||role.includes('採購'))task='週初檢視裸石、採購選品與本週主打方向';
 else if(role.includes('行銷')||role.includes('客服'))task='準備回覆客人、整理 FB 詢問與商品內容';
 else if(role.includes('特助')||role.includes('包裝')||role.includes('出貨'))task='準備核對訂單、包貨與寄件';
 else task='整理本週待辦與交接事項';
 const replies={
  status:`我現在在${task}。${progress?progress+'，': ''}目前士氣 ${morale}，工作負荷 ${loadValue}。`,
  progress:`${task}。${progress||'目前還在週初安排，工作時段開始後才會進入執行。'}${assigned.length||ongoing.length?' 有列入工作計畫。':' 這是日常工作，會配合本週訂單持續處理。'}`,
  blocker:loadValue>100?'手上的事情有點多，可能需要同事分擔或調整本週安排。':morale<45?'最近士氣比較低，先讓我把手上的事情做好，也希望能談談工作負荷。':'目前沒有明顯卡關；如果遇到商品、客人或交期問題，我會整理資訊再向你回報。',
  morale:morale>=75?`目前士氣 ${morale}/100，狀態還不錯；工作負荷是 ${loadValue}。`:morale>=45?`目前士氣 ${morale}/100，有些疲累。若能減少超載或把流程理順，會比較容易穩定下來。`:`目前士氣 ${morale}/100，偏低。我需要你看看工作量、支援或溝通上有沒有能調整的地方。`
 };
 return {task,progress,reply:replies[question]||replies.status,shift:shift.action,weekday:shift.weekday,time:shift.time,morale,load:loadValue,orders:liveOrders};
}
function load(s,id,plans=s.plans){const p=s.staff.find(p=>p.id===id);return 36+plans.filter(a=>a.person===id).reduce((n,a)=>n+byId[a.card].load,0)+(p?.pip?10:0)+s.staff.filter(p=>p.pip?.owner===id).length*9;}
function recommend(s,c){return [...s.staff].sort((a,b)=>(effective(b,c.skill)-load(s,b.id)*.35)-(effective(a,c.skill)-load(s,a.id)*.35))[0]?.id;}
function plan(s,id){if(s.phase!=='planning')return '本週安排已鎖定';const c=byId[id];if(!c||!available(s,c))return '尚未開放';if(s.plans.length>=3)return '每週最多三項行動';if(s.plans.some(p=>p.card===id))return '本週不能重複同一張卡';s.plans.push({card:id,person:recommend(s,c),target:s.staff.find(p=>p.id!=='regina')?.id||'regina',skill:c.skill,role:'行銷客服',external:false,ongoing:false});return '';}
function cost(s,p){return (p.ongoing?0:byId[p.card].cost)+(p.external&&!p.ongoing?40000:0);}
function start(s){if(s.phase!=='planning')return '目前不能開始';for(const p of s.plans){if(!s.staff.some(x=>x.id===p.person))return '請指定仍在職的負責人';if(p.card==='hire'&&p.role==='HR'&&s.chapter<4)return '第五關才開放 HR';if(['train','assess','pip'].includes(p.card)&&!s.staff.some(x=>x.id===p.target))return '請指定有效的對象';if(p.card==='pip'&&p.target==='regina')return '改善計畫適用於員工，請選擇其他對象';if(p.card==='pip'&&s.staff.find(x=>x.id===p.target).pip)return '該員工正在改善';}
 const fees=s.plans.reduce((n,p)=>n+cost(s,p),0);if(s.cash<fees)return '現金不足，請減少投入';s.cash-=fees;s.chapterProfit-=fees;
 const results=s.plans.map(p=>{const c=byId[p.card],who=s.staff.find(x=>x.id===p.person),workload=load(s,who.id),ability=effective(who,c.skill),quality=clamp(ability/85*(.65+who.hidden.effort*.45)*(workload>100?100/workload:1)*( .9+rand(s)*.2),.25,1.2);return {...copy(p),quality,load:workload,ability,cost:cost(s,p)};});
 const ids=results.map(r=>r.card),synergy=ids.includes('select')&&(ids.includes('post')||ids.includes('loyal'))?.16:0;
 const skillsAvg=s.staff.reduce((n,p)=>n+effective(p,'ops'),0)/s.staff.length;const cap=Object.entries(s.capabilities).filter(([k])=>!['diligence','governance','listing'].includes(k)).reduce((n,[,v])=>n+Math.min(3,v)*.14,0);
 const market=worldStatus(s);const taskEffect=results.reduce((n,r)=>{let f=1;const id=r.card;if(id==='live')f*=market.live;if(id==='video')f*=market.video;if(id==='ads')f*=market.ads;if(id==='loyal')f*=market.retention;return n+byId[id].effect*r.quality*f;},0),excess=results.reduce((n,r)=>n+Math.max(0,r.load-100),0);
 const base=2000000*12/52*chapters[s.chapter].base,capacity=clamp(s.staff.length/3*(1+s.flow*.04),.4,1.2),demand=clamp(1+(market.online-1)*.60+(market.offline-1)*.28+(market.confidence-1)*.12, .62,1.35),revenue=base*(1+cap+taskEffect+synergy)*(s.brand/65)*(.8+skillsAvg/300)*capacity*demand*(.94+rand(s)*.12)*clamp(1-excess*.0015,.6,1);
 const goods=revenue*(.08+rand(s)*.02+(ids.includes('sale')?.04:0)+(s.capabilities.crystal?.025:0))*market.shipping;
 const overhead=revenue*.30+s.staff.filter(p=>p.id!=='regina'&&!p.id.startsWith('founder')).reduce((n,p)=>n+p.salary,0)*12/52+[0,25000,65000][s.office]*12/52+s.debt*.0015,marketing=revenue*.10;
 s.run={results,forecast:{revenue,goods,overhead,marketing,orders:Math.round(revenue/(ids.includes('sale')?5200:6500)),net:revenue-goods-overhead-marketing},expenses:fees+(s.preExpenses||0),eventNet:0,eventRevenue:0,eventReports:[],events:[],ticker:[],current:null,synergy,settled:false,market,attendance:[{day:0,clockIn:true,clockOut:false}]};s.preExpenses=0;
 const count=1+Math.floor(rand(s)*3);for(let i=0;i<count;i++)s.run.events.push(makeEvent(s,(i+1)/(count+1)*WEEK_MS,i));
 const startMs=Date.parse(date(s)+'T00:00:00Z'),endMs=startMs+7*86400000;for(const n of newsEvents){if((s.seenNews||[]).includes(n.id))continue;const when=Date.parse(n.date+'T00:00:00Z');if(when>=startMs-7*86400000&&when<endMs){const at=Math.max(800,Math.min(WEEK_MS-500,(when-startMs)/7/86400000*WEEK_MS));s.run.events.push(newsEvent(n,at,'headline-'+n.id));s.run.ticker.push({tag:'新聞・'+n.scope,text:n.title+' · 老闆決策待處理',news:true,storyId:n.id});}}
 const pulse=marketTicker(s);for(let i=0;i<4;i++)s.run.ticker.push({tag:pulse.tag,text:marketTicker({...s,elapsed:i*18000}).text,simulated:true});for(let i=s.run.ticker.length-1;i>0;i--){const j=Math.floor(rand(s)*(i+1));[s.run.ticker[i],s.run.ticker[j]]=[s.run.ticker[j],s.run.ticker[i]];}if(!s.run.ticker.length)s.run.ticker=[pulse];s.run.events.sort((a,b)=>a.at-b.at);s.phase='running';s.elapsed=0;s.tutorial=false;historyNews(s);log(s,'開始本週：'+(ids.map(x=>byId[x].name).join('、')||'維持日常營運'));return '';}
function makeEvent(s,at,i){const options=['supplier','quality','client','contract','staff'];const type=options[(s.totalWeek+i)%options.length],who=s.staff[(s.totalWeek+i)%s.staff.length],bad=rand(s)<.42,mislead=who.hidden.honesty<.35||who.hidden.effort<.25;const e={id:s.totalWeek+'-'+i,type,at,speaker:who.id,bad,mislead,asked:[],evidence:[],answer:'',resolved:false,title:'',art:'offer',statement:'',facts:[],questions:[],choices:[]};
 if(type==='supplier'){e.title='供應商的限時報價';e.statement=mislead?'這批彩寶價格很好，我認為條件沒有問題，可以直接下單。':'供應商說這批價格有優勢，但我還沒確認所有交貨條件。';e.facts=[`報價單：整批 NT$80,000。${bad?'備註另收處理費 NT$25,000，瑕疵不退。':'已含處理費，瑕疵品可七日換貨。'}`,`歷史交貨紀錄：${bad?'最近三批有兩批延遲，尚有一筆補件未結。':'最近三批按期交貨，補件已完成。'}`];e.questions=['你確認過哪些條件？','這批適合哪一類客人？'];e.choices=[['accept','批准採購',80000],['revise','要求樣品與條件修訂',20000],['reject','暫不採購',0]];}
 if(type==='quality'){e.title='客人反映商品與說明不同';e.art='crisis';e.statement=mislead?'應該是客人誤會，我們出貨時沒有問題。':'客人說顏色與照片有差異，我們需要核對出貨紀錄。';e.facts=[`出貨檢核：${bad?'未留存自然光照片，規格欄有一項空白。':'規格與照片完整，客人選擇記錄可核對。'}`,`客服紀錄：${bad?'客人付款前曾問處理方式，但未收到完整回答。':'客人已確認商品處理方式與色差提醒。'}`];e.questions=['客人付款前收到什麼資訊？','出貨時誰做最後確認？'];e.choices=[['accept','安排退換與改善',30000],['revise','先核對並安排專人溝通',12000],['reject','按原說明處理',0]];}
 if(type==='client'){e.title='熟客介紹了一筆訂單';e.art='gems';e.statement='客戶想訂一批禮物，可能有十五萬營業額，但需要我們特別安排。';e.facts=[`需求單：總額 NT$150,000，全額轉帳後排單；${bad?'指定交貨時間比目前正常工期短三天。':'交期為三週，可分批交付。'}`,`內部排程：${bad?'同週尚有兩筆急件，人手偏緊。':'目前可承接，客製規格仍需確認。'}`];e.questions=['交期是否真的做得到？','哪些規格還沒確認？'];e.choices=[['accept','承接並安排支援',20000],['revise','協商較長交期',5000],['reject','婉拒這次機會',0]];}
 if(type==='contract'){e.title='合作方希望先簽約';e.art='offer';e.statement=mislead?'這是標準合約，條件都談好了，今天簽就有優惠。':'對方希望今天確認，費用與授權條款我還想再核對。';e.facts=[`合約摘要：首期 NT$60,000；${bad?'提前終止須支付剩餘年度費用，素材使用權歸合作方。':'可提前三十天終止，素材權利歸公司。'}`,`往來紀錄：${bad?'口頭承諾與正式附件的服務項目不一致。':'服務項目與附件一致，排程仍需確認。'}`];e.questions=['你逐項看過附件嗎？','如果合作無效，怎麼退出？'];e.choices=[['accept','批准合作',60000],['revise','要求修改再合作',20000],['reject','拒絕這次合作',0]];}
 if(type==='staff'){e.title='同事提出工作調整';e.art='training';e.statement=mislead?'我已經學會新方法，可以接更多工作，不需要再驗證。':'最近工作有些趕，我想調整方法，請你決定優先順序。';e.facts=[`近期工作記錄：${bad?'三項承諾只有一項準時完成，兩份紀錄待補。':'三項工作準時完成，但精力下降。'}`,`學習紀錄：${bad?'完成課程觀看，尚無實作成果。':'已有一份實作，但尚未經他人核對。'}`];e.questions=['有哪些實作成果？','目前工作負荷怎麼安排？'];e.choices=[['accept','提供支援與實作機會',15000],['revise','先核對成果再授權',5000],['reject','維持現有安排',0]];}
 return e;}
function currentEvent(s){return s.run?.events.find(e=>e.id===s.run.current);}
function ask(s,index){const e=currentEvent(s);if(!e||s.phase!=='event')return;const q=e.questions[index];if(!q)return;if(!e.asked.includes(index))e.asked.push(index);e.answer=e.mislead?'我認為沒有大問題，細節主要是依合作方與同事提供的資訊，完整紀錄還需要核對。':(index===0?'我目前能確認的是：'+e.facts[0]:'還有不確定的部分：'+e.facts[1]);}
function evidence(s,index){const e=currentEvent(s);if(e&&!e.evidence.includes(index)&&e.facts[index])e.evidence.push(index);}
function resolve(s,choice){if(s.phase!=='event')return '目前沒有待決策事件';const e=currentEvent(s);if(!e||e.resolved)return '已處理';if(e.type==='news'){const n=newsEvents.find(x=>x.id===e.storyId),opt=e.choices.find(c=>c[0]===choice);if(!n||!opt)return '請選擇有效方案';if(s.cash<opt[2])return '現金不足，請選擇其他處理方式';expense(s,opt[2]);shock(s,n.id,n.mods,n.duration,n.title);if(Object.keys(opt[3]||{}).length)shock(s,'choice-'+n.id,opt[3],4,'應對：'+opt[1]);s.seenNews=s.seenNews||[];if(!s.seenNews.includes(n.id))s.seenNews.push(n.id);s.newsLog=s.newsLog||[];s.newsLog.unshift({id:n.id,date:n.date,title:n.title,scope:n.scope,choice:opt[1],game:n.game,source:n.source});s.brand=clamp(s.brand+(choice==='wait'||choice==='hold'?-1:1),20,100);e.resolved=true;e.choice=choice;const result=`${opt[1]}。${n.game} 市場影響預計持續 ${n.duration} 週。`;s.run.eventReports.push({title:n.title,result,advice:'每週檢視需求、廣告與履約成本；這是遊戲模擬效果。'});s.run.current=null;s.phase='running';log(s,'新聞決策：'+n.title+'／'+opt[1]);return ''; }if(choice==='investigate'){if(s.cash<30000)return '現金不足';expense(s,30000);s.inquiries.push({due:s.totalWeek+1,event:copy(e),speaker:e.speaker});e.resolved=true;s.run.eventReports.push({title:e.title,result:'已付 3 萬委託查核，下週收到報告；本次機會暫緩。',advice:'待取得獨立資料，再評估後續合作。'});s.run.current=null;s.phase='running';return '';}
 const opt=e.choices.find(c=>c[0]===choice);if(!opt)return '請選擇有效方案';if(s.cash<opt[2])return '現金不足，請選擇其他處理方式';expense(s,opt[2]);let extra=0,loss=0,trust=0,description='';
 if(e.type==='supplier'){if(choice==='accept'){extra=e.bad?40000:160000;loss=e.bad?70000:0;trust=e.bad?-3:1;description=e.bad?'到貨有額外費用與延遲，壓縮了成果。':'商品順利到貨，帶來額外成交。';}else description=choice==='revise'?'先取得樣品與條件，保留後續合作空間。':'保留資金，但放棄本次貨源。';}
 if(e.type==='client'){extra=choice==='accept'?150000:choice==='revise'?110000:0;loss=choice==='accept'&&e.bad?60000:0;trust=loss?-4:choice==='reject'?0:2;description=loss?'完成接單，但急件導致加急費與服務壓力。':extra?'客戶接受安排，訂單已確認。':'婉拒訂單，保留團隊產能。';}
 if(e.type==='contract'){extra=choice==='accept'&&!e.bad?160000:choice==='revise'?60000:0;loss=choice==='accept'&&e.bad?180000:0;description=loss?'合作條件造成額外履約成本，口頭承諾未落實。':choice==='reject'?'未簽下本次合作。':'按確認後的條件推進合作。';}
 if(e.type==='quality'){trust=choice==='accept'?4:choice==='revise'?2:e.bad?-7:-1;loss=choice==='reject'&&e.bad?50000:0;description=choice==='reject'?'維持原處理方式，客戶反應影響了信任。':'完成客戶溝通並留下商品核對紀錄。';}
 if(e.type==='staff'){const change=choice==='accept'?4:choice==='revise'?1:-2;s.morale=clamp(s.morale+change,15,100);const employee=s.staff.find(x=>x.id===e.speaker);if(employee)employee.morale=clamp((employee.morale??78)+change,15,100);description=choice==='accept'?'提供工作支援，後續仍需要實作驗證。':choice==='revise'?'保留原授權，先核對成果。':'維持原工作分配。';}
 if(extra){const net=extra*.55;s.cash+=net;s.chapterProfit+=net;s.run.eventNet+=net;s.run.eventRevenue+=extra;}if(loss){expense(s,loss);}s.brand=clamp(s.brand+trust,20,100);e.resolved=true;e.choice=choice;
 const p=s.staff.find(x=>x.id===e.speaker);if(p){p.records.push({week:s.totalWeek,text:e.title+'：'+description,issue:e.bad&&choice==='accept'});p.records=p.records.slice(-30);}
 s.run.eventReports.push({title:e.title,result:description,advice:e.bad&&choice==='accept'?'下次先核對文件與交付條件，避免只依口頭承諾。':'保留查證與處理紀錄，追蹤後續成果。'});s.run.current=null;s.phase='running';if(s.cash<=0){s.phase='failed';s.failure='現金不足以繼續經營';}return '';}
function recordAttendance(s,from,to){if(!s.run)return;for(let day=1;day<5;day++){const start=day*DAY_MS;if(from<start&&to>=start&&!s.run.attendance.some(a=>a.day===day))s.run.attendance.push({day,clockIn:true,clockOut:false});}for(let day=0;day<5;day++){const close=day*DAY_MS+WORKDAY_MS;if(from<close&&to>=close){const item=s.run.attendance.find(a=>a.day===day);if(item)item.clockOut=true;}}}
function advanceTime(s,ms){if(s.phase!=='running')return;const from=s.elapsed,next=clamp(from+ms,0,WEEK_MS),e=s.run.events.find(e=>!e.resolved&&e.at<=next);if(e){recordAttendance(s,from,e.at);s.elapsed=e.at;s.run.current=e.id;s.phase='event';return;}recordAttendance(s,from,next);s.elapsed=next;if(next>=WEEK_MS)settle(s);}
function settle(s){if(!s.run||s.run.settled)return;s.run.settled=true;const r=s.run,f=r.forecast;s.cash+=f.net;s.chapterProfit+=f.net;s.chapterRevenue+=f.revenue+r.eventRevenue;s.totalRevenue+=f.revenue+r.eventRevenue;for(const x of s.worldShocks||[])x.left--;s.worldShocks=(s.worldShocks||[]).filter(x=>x.left>0);
 const tips=[];s.ongoing=[];for(const a of r.results){const c=byId[a.card],p=s.staff.find(x=>x.id===a.person),target=s.staff.find(x=>x.id===a.target);a.left=(a.left??c.duration)-1;a.completed=a.left<=0;a.title=c.name;a.message='';
 if(a.left>0){s.ongoing.push({...a,ongoing:true});a.message=`進度 ${c.duration-a.left}/${c.duration} 週；品質 ${a.quality>.8?'穩定':'有待改善'}。`;}
 else if(c.duration>1){const ok=a.quality>.42;if(c.id==='listing'){if(ok&&s.chapterProfit>0&&s.cash>1000000&&s.morale>=45){s.capabilities.listing=1;a.message='遊戲上市準備審查完成。';}else{a.message='尚未具備穩定獲利、百萬現金與團隊條件，需重新準備。';a.completed=false;}}
 else if(ok){s.capabilities[c.id]=(s.capabilities[c.id]||0)+1;a.message='企劃完成，能力已加入常態業務。';}else{a.message='企劃未達預期，本次結束，投入不退。';a.completed=false;}}
 else if(c.id==='hire'){s.candidates=[0,1,2].map(i=>candidate(s,a.role,i));a.message='三位候選人已到齊，可錄用一位或全部放棄。';}
 else if(c.id==='train'&&target){const gain=target.hidden.learn>.55&&target.hidden.effort>.45?3+Math.floor(target.hidden.learn*4):target.hidden.learn>.25?1:0;target.skills[a.skill]=clamp(target.skills[a.skill]+gain,10,99);target.training={skill:a.skill,gain,at:s.totalWeek};a.message='已完成課程；員工回報已學會，實際成效請用工作或考核驗證。';}
 else if(c.id==='assess'&&target){const expertise=a.external?85:p.skills[a.skill],error=(rand(s)-.5)*(100-expertise)*.5,score=Math.round(clamp(target.skills[a.skill]*(.6+target.hidden.effort*.4)+error,0,100));a.message=`${a.external?'外部顧問':p.name}評估 ${target.name}：實作品質 ${score}/100；${score>70?'主要步驟完整。':'部分步驟需補強。'}評分為考核者判斷。`;target.records.push({week:s.totalWeek,text:a.message,issue:score<55});}
 else if(c.id==='pip'&&target){target.pip={left:4,owner:p.id,baseline:target.skills.ops,started:s.totalWeek};a.message='四週改善期啟動；員工維持原工作，負責人持續追蹤。';}
 else{a.message=a.quality>.8?'按計畫完成，品質與進度穩定。':a.quality>.6?'完成主要工作，但部分細節有待改善。':'執行品質不足，未充分發揮這項行動的效果。';}
 if(c.id==='process')s.flow=Math.min(8,s.flow+a.quality);if(c.id==='authority')s.guard=Math.min(5,s.guard+1);
 if(p){p.skills[c.skill]=Math.min(99,p.skills[c.skill]+p.hidden.effort*.5);p.energy=clamp(p.energy-(a.load>100?8:2),25,100);}
 a.advice=a.load>100?'負責人超載。下週減少兼任，或安排其他同事接手。':a.quality<.65?'比較人員專長，先補足技能或改善流程。':c.duration>1?'評估成果能否持續，不因已投入就繼續加碼。':'保留有效搭配，觀察客群與履約能力。';tips.push(a.advice);}
 for(const p of s.staff){p.energy=clamp(p.energy+3,25,100);if(p.pip&&p.pip.started<s.totalWeek){p.pip.left--;if(p.hidden.effort>.55)p.skills.ops=Math.min(99,p.skills.ops+1.5);if(p.pip.left<=0){const improved=p.skills.ops-p.pip.baseline>=4;p.exitReady=!improved;s.notices.push({title:p.name+' 改善期結束',text:improved?'實際工作已有改善，繼續追蹤。':'未達改善標準，進入離職確認流程。'});p.pip=null;}}if(p.adapt)p.adapt--;}
 for(const p of s.staff){const assigned=r.results.filter(a=>a.person===p.id),burden=assigned.reduce((n,a)=>Math.max(n,a.load||0),36),change=burden>100?-6:burden>82?-3:p.energy<48?-2:1;p.morale=clamp((Number.isFinite(p.morale)?p.morale:78)+change,15,100);}s.morale=Math.round(s.staff.reduce((n,p)=>n+(Number.isFinite(p.morale)?p.morale:78),0)/Math.max(1,s.staff.length));s.brand=clamp(s.brand+(r.results.some(a=>a.card==='quality')?1:.1),20,100);
 s.week++;s.totalWeek++;r.report={date:date(s),revenue:f.revenue+r.eventRevenue,goods:f.goods+r.eventRevenue-r.eventNet,overhead:f.overhead,marketing:f.marketing,extra:r.expenses,net:f.net+r.eventNet-r.expenses,orders:f.orders,results:copy(r.results),events:copy(r.eventReports),cash:s.cash,attendance:copy(r.attendance||[]),morale:s.morale,staffMorale:s.staff.map(p=>({name:p.name,morale:p.morale}))};s.history.unshift(r.report);s.month.push(r.report);if(s.totalWeek%4===0){s.reports.unshift({to:date(s),weeks:s.month.length,revenue:s.month.reduce((n,w)=>n+w.revenue,0),net:s.month.reduce((n,w)=>n+w.net,0),cash:s.cash});s.month=[];r.monthReady=true;}
 s.phase=s.cash<=0?'failed':'reveal';s.failure=s.cash<=0?'現金不足以繼續經營':'';s.revealIndex=0;log(s,'本週結算，營收 '+Math.round(r.report.revenue/10000)+' 萬');}
function candidate(s,role,i){const names=['雅筑','舒涵','品妍','思妤','宛庭','予安','靜宜','若瑜','映潔'];const vals=Object.fromEntries(Object.keys(skills).map(k=>[k,38+Math.floor(rand(s)*45)]));const key=role==='HR'?'people':role==='包裝出貨'?'ops':'marketing';vals[key]=55+Math.floor(rand(s)*35);const p=person(s,'staff-'+s.totalWeek+'-'+i,names[Math.floor(rand(s)*names.length)],role,role==='HR'?'hr':role==='包裝出貨'?'assistant':'marketing',vals);p.salary=35000+Math.round(vals[key]/10)*2000;p.adapt=1;return p;}
function hire(s,id){if(s.phase!=='reveal')return '請在週末選擇';const p=s.candidates.find(x=>x.id===id);if(!p)return '候選人已不在名單';if(s.staff.length+s.arrivals.length>=[3,6,12][s.office])return '座位已滿，請先擴張辦公室或暫不錄用';s.arrivals.push(p);s.candidates=[];s.notices.push({title:'錄用 '+p.name,text:'下週到職，第一週為適應期。'});return '';}
function rating(s){const over=s.chapterRevenue/chapters[s.chapter].target,margin=s.chapterProfit/Math.max(1,s.chapterRevenue),health=s.morale/100;const score=clamp(Math.round(45*Math.min(1.3,over)+30*clamp(margin/.35,0,1)+25*health-(s.extended?12:0)),0,100);return {score,rank:score>=90?'S':score>=75?'A':score>=60?'B':'C',over:s.chapterRevenue-chapters[s.chapter].target,margin};}
function nextWeek(s){if(s.phase!=='reveal')return;s.candidates=[];const c=chapters[s.chapter],limit=c.weeks+(s.extended?4:0);if(s.week>=limit){const pass=s.chapterRevenue>=c.target&&(s.chapter!==6||s.capabilities.listing);s.phase=pass?'chapterWon':s.extended?'failed':'extension';if(!pass&&s.extended)s.failure='延長期結束仍未完成本關目標';if(pass){s.stageResults.push({chapter:s.chapter,revenue:s.chapterRevenue,profit:s.chapterProfit,...rating(s)});}return;}planning(s);}
function historyNews(s){s.seenNews=s.seenNews||[];for(const h of histories)if(h.date<=date(s)&&!s.seenNews.includes(h.date)){s.seenNews.push(h.date);s.notices.push({title:h.date+'｜'+h.title,text:h.body});log(s,'時代記事：'+h.title);}}
function planning(s){historyNews(s);s.phase='planning';s.elapsed=0;s.run=null;s.staff.push(...s.arrivals);s.arrivals=[];s.plans=s.ongoing.map(a=>({...a,ongoing:true}));for(const i of s.inquiries.filter(i=>i.due<=s.totalWeek)){s.notices.push({title:'獨立查核：'+i.event.title,text:i.event.facts.join(' ')+' 顧問建議：'+(i.event.bad?'先處理不一致之處再承諾。':'目前文件大致一致，仍需追蹤實際履約。')});const p=s.staff.find(p=>p.id===i.speaker);if(p)p.records.push({week:s.totalWeek,text:'獨立查核：'+i.event.facts.join(' '),issue:i.event.bad});}s.inquiries=s.inquiries.filter(i=>i.due>s.totalWeek);}
function extend(s){if(s.phase!=='extension')return;s.extended=true;planning(s);log(s,'使用一次四週延長，評價扣分。');}
function nextChapter(s){if(s.phase!=='chapterWon')return;if(s.chapter===6){s.phase='complete';return;}s.chapter++;s.week=0;s.chapterRevenue=0;s.chapterProfit=0;s.extended=false;planning(s);snapshot(s);log(s,'進入第 '+(s.chapter+1)+' 關');}
function retry(s){const q=copy(s.levelStart);q.levelStart=copy(q);return q;}
function expand(s){if(!['planning','reveal'].includes(s.phase))return '本週執行中不能搬遷';if(s.office>=2)return '已達最大空間';const fee=[600000,1200000][s.office];if(s.cash<fee)return '現金不足';expense(s,fee);s.office++;return '';}
function cancel(s,id){if(s.phase!=='planning')return '本週已鎖定';s.plans=s.plans.filter(p=>p.card!==id);s.ongoing=s.ongoing.filter(p=>p.card!==id);return '';}
function dismiss(s,id){if(s.phase!=='planning')return '請在週初處理';const p=s.staff.find(p=>p.id===id);if(!p||!p.exitReady||id==='regina')return '不符合離職確認條件';const fee=p.salary;if(s.cash<fee)return '現金不足以完成遊戲離職費用';expense(s,fee);s.staff=s.staff.filter(p=>p.id!==id);s.plans.forEach(a=>{if(a.person===id)a.person=recommend(s,byId[a.card]);if(a.target===id)a.target='regina';});s.morale=Math.max(15,s.morale-3);log(s,p.name+' 離職，工作已重新分配。');return '';}
function finance(s,type){if(s.phase!=='planning'||s.chapter!==6)return '第七關週初才可調整資金';if(type==='loan'){if(s.debt>=3000000)return '已達本版借款額度';s.debt+=1000000;s.cash+=1000000;}else{if(s.equity<=60)return '保留至少 60% 股權';s.equity-=10;s.cash+=2000000;}log(s,type==='loan'?'新增借款 100 萬，按週計息。':'引進股東 200 萬，股權稀釋 10%。');return '';}
return {VERSION,WEEK_MS,DAY_MS,WORKDAY_MS,histories,newsEvents,chapters,skills,cards,byId,initial,copy,date,available,plan,load,recommend,start,advanceTime,workSchedule,employeeStatus,currentEvent,ask,evidence,resolve,nextWeek,extend,nextChapter,retry,expand,cancel,dismiss,hire,rating,finance,ticker,worldStatus};
})();
if(typeof module!=='undefined')module.exports=Game;
