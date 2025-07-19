import{r as f,j as a}from"./iframe-CRUSmV3d.js";const q=["일","월","화","수","목","금","토"],D=({events:w=[],initialDate:N=new Date,onDateSelect:S,showNavigation:F=!0,showHolidays:x=!0})=>{const[g,j]=f.useState(N),[C,v]=f.useState(null),o=g.getFullYear(),r=g.getMonth(),E=w.reduce((e,t)=>(e[t.date]||(e[t.date]=[]),e[t.date].push(t),e),{}),b=(e,t,s)=>{const n=String(t+1).padStart(2,"0"),l=String(s).padStart(2,"0");return`${e}-${n}-${l}`},H=e=>{const t=new Date;return t.getFullYear()===o&&t.getMonth()===r&&t.getDate()===e},T=e=>E[e]||[],W=()=>{const e=new Date(o,r,1).getDay(),t=new Date(o,r+1,0).getDate(),s=[];for(let n=0;n<e;n+=1)s.push(null);for(let n=1;n<=t;n+=1){const l=b(o,r,n),k={date:l,day:n,events:T(l),isToday:H(n),isSelected:C===l,isHoliday:x&&new Date(o,r,n).getDay()===0};s.push(k)}for(;s.length%7!==0;)s.push(null);return s},y=e=>{const t=new Date(o,r+e,1);j(t),v(null)},$=e=>{v(e.date),S?.(e.date)},A=W();return a.jsxs("div",{className:"calendar-container",children:[F&&a.jsxs("div",{className:"calendar-header",children:[a.jsx("button",{className:"nav-button",onClick:()=>y(-1),children:"◀"}),a.jsxs("h2",{className:"month-title",children:[o,"년 ",r+1,"월"]}),a.jsx("button",{className:"nav-button",onClick:()=>y(1),children:"▶"})]}),a.jsx("div",{className:"calendar-grid header",children:q.map(e=>a.jsx("div",{className:"day-header",children:e},e))}),a.jsx("div",{className:"calendar-grid body",children:A.map((e,t)=>a.jsx("div",{className:`day-cell 
                            ${e===null?"empty":""} 
                            ${e?.isToday?"today":""} 
                            ${e?.isSelected?"selected":""} 
                            ${e?.isHoliday?"holiday":""} 
                            ${(e?.events||[]).length>0?"has-events":""}`,onClick:()=>e&&$(e),children:e?a.jsxs("div",{className:"day-content",children:[a.jsx("div",{className:"day-number",children:e.day}),e.events&&e.events.length>0&&a.jsx("div",{className:"events-container",children:e.events.map((s,n)=>a.jsx("div",{className:`event-item-inline ${s.type}`,style:{backgroundColor:s.color,color:"#fff",fontWeight:600},children:a.jsx("span",{className:"event-title-inline",children:s.title})},s.id))})]}):""},t))})]})};D.__docgenInfo={description:"",methods:[],displayName:"Calendar",props:{events:{required:!1,tsType:{name:"Array",elements:[{name:"EventData"}],raw:"EventData[]"},description:"",defaultValue:{value:"[]",computed:!1}},initialDate:{required:!1,tsType:{name:"Date"},description:"",defaultValue:{value:"new Date()",computed:!1}},onDateSelect:{required:!1,tsType:{name:"signature",type:"function",raw:"(date: string) => void",signature:{arguments:[{type:{name:"string"},name:"date"}],return:{name:"void"}}},description:""},showNavigation:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},showHolidays:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}}}};const h=[{id:"1",title:"서울 봄꽃 축제",type:"capital",color:"#4CAF50",date:"2025-07-08"},{id:"2",title:"강남 패션 축제",type:"capital",color:"#4CAF50",date:"2025-07-08"},{id:"3",title:"부산 해운대 축제",type:"local",color:"#FF9800",date:"2025-07-11"},{id:"4",title:"제주 한라산 축제",type:"local",color:"#FF9800",date:"2025-07-11"},{id:"5",title:"대구 동성로 축제",type:"local",color:"#FF9800",date:"2025-07-18"},{id:"6",title:"인천 송도 축제",type:"capital",color:"#4CAF50",date:"2025-07-18"},{id:"7",title:"광주 무등산 축제",type:"local",color:"#FF9800",date:"2025-07-18"},{id:"8",title:"대전 엑스포 축제",type:"local",color:"#FF9800",date:"2025-07-21"},{id:"9",title:"울산 태화강 축제",type:"local",color:"#FF9800",date:"2025-07-21"},{id:"10",title:"수원 화성 축제",type:"capital",color:"#4CAF50",date:"2025-07-25"},{id:"11",title:"전주 한옥마을 축제",type:"local",color:"#FF9800",date:"2025-07-17"}],_={title:"Components/Calendar",component:D,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{events:{description:"이벤트 데이터 배열",control:{type:"object"}},initialDate:{description:"초기 표시 날짜",control:{type:"date"}},onDateSelect:{description:"날짜 선택 시 호출되는 콜백 함수",action:"dateSelected"},showNavigation:{description:"월 이동 네비게이션 표시 여부",control:{type:"boolean"}},showHolidays:{description:"공휴일 표시 여부",control:{type:"boolean"}}}},i={args:{}},c={args:{events:h}},d={args:{events:h,initialDate:new Date("2025-07-01")}},p={args:{events:h,showNavigation:!1}},u={args:{events:h,showHolidays:!1}},m={args:{events:[],showNavigation:!0,showHolidays:!0}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    events: sampleEvents
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    events: sampleEvents,
    initialDate: new Date('2025-07-01')
  }
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    events: sampleEvents,
    showNavigation: false
  }
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    events: sampleEvents,
    showHolidays: false
  }
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    events: [],
    showNavigation: true,
    showHolidays: true
  }
}`,...m.parameters?.docs?.source}}};const I=["Default","WithEvents","WithInitialDate","WithoutNavigation","WithoutHolidays","Empty"];export{i as Default,m as Empty,c as WithEvents,d as WithInitialDate,u as WithoutHolidays,p as WithoutNavigation,I as __namedExportsOrder,_ as default};
