import{a as u,ab as m,j as t,I as g,ae as f}from"./index-Ba-_IHuQ.js";const h=s=>{switch(s){case"ar":return"Ar";case"tr":return"Tr";default:return"En"}},w=()=>{const{currentLanguage:s}=u(),{settings:e}=m(),n=h(s),c=`notFoundTitle${n}`,o=`notFoundDesc${n}`,i=`notFoundButton${n}`,l=`notFoundSvg${n}`,x=e[c],r=e[o],d=e[i],a=e[l];return t.jsx("div",{className:"min-h-screen w-full flex items-center justify-center bg-white dark:bg-[#181926] transition-colors px-2",children:t.jsxs("div",{className:"flex flex-col items-center text-center gap-8 w-full max-w-lg",children:[t.jsx("div",{className:"mb-1",children:a&&typeof a=="string"?t.jsx("img",{src:a,alt:"Not Found",className:"w-64 h-64 md:w-96 md:h-96 object-contain mx-auto"}):t.jsx("div",{className:"w-64 h-64 md:w-96 md:h-96 flex items-center justify-center text-7xl md:text-9xl font-black select-none text-[#9ca3af] dark:text-[#464965] mx-auto",children:"404"})}),t.jsx("h2",{className:"text-2xl font-bold text-gray-900 dark:text-white animate-fade-in",children:String(x||"")}),r&&t.jsx("p",{className:"text-gray-600 dark:text-gray-300 -mt-4",children:String(r)}),t.jsx(g,{asChild:!0,size:"lg",variant:"default",className:`
            w-full max-w-xs mx-auto
            bg-brand-accent text-brand-accent-foreground
            hover:brightness-95 text-base font-bold
            transition-all rounded-md
            shadow-[0_0_18px_0_rgba(54,156,164,0.18)]
            !shadow-lg
            py-4
            flex justify-center items-center
            tracking-wide
            `,style:{boxShadow:"0 4px 16px 2px rgba(54,156,164,0.20)"},children:t.jsx(f,{to:"/",tabIndex:0,className:"w-full text-center",children:String(d||"")})})]})})};export{w as default};
