"use strict";(self.webpackChunkrenote=self.webpackChunkrenote||[]).push([[5815],{1455:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>r,default:()=>d,frontMatter:()=>i,metadata:()=>a,toc:()=>u});var t=s(5893),o=s(1151);const i={},r="Deploy to GitHub Pages",a={id:"docusaurus/deploy-github-pages",title:"Deploy to GitHub Pages",description:"From my experience deploy this site (Docusaurus v3) to GitHub Pages, I will note some steps here.",source:"@site/docs/docusaurus/deploy-github-pages.mdx",sourceDirName:"docusaurus",slug:"/docusaurus/deploy-github-pages",permalink:"/renote/docs/docusaurus/deploy-github-pages",draft:!1,unlisted:!1,editUrl:"https://github.com/xREMAGIx/renote/tree/main/docs/docusaurus/deploy-github-pages.mdx",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Docusaurus",permalink:"/renote/docs/category/docusaurus"},next:{title:"Git",permalink:"/renote/docs/category/git"}},l={},u=[{value:"docusaurus.config.js settings",id:"docusaurusconfigjs-settings",level:3},{value:"Deploy",id:"deploy",level:3},{value:"Triggering deployment with GitHub Actions",id:"triggering-deployment-with-github-actions",level:3}];function c(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"deploy-to-github-pages",children:"Deploy to GitHub Pages"}),"\n",(0,t.jsxs)(n.admonition,{type:"info",children:[(0,t.jsx)(n.p,{children:"From my experience deploy this site (Docusaurus v3) to GitHub Pages, I will note some steps here."}),(0,t.jsxs)(n.p,{children:["For more information, please reference to official link: ",(0,t.jsx)(n.a,{href:"https://docusaurus.io/docs/deployment#deploying-to-github-pages",children:"Docusaurus-Deploy to GitHub Pages"})]})]}),"\n",(0,t.jsx)(n.h3,{id:"docusaurusconfigjs-settings",children:"docusaurus.config.js settings"}),"\n",(0,t.jsx)(n.p,{children:"First, modify your docusaurus.config.js and changes the following params:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"url"}),": your github pages url"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"baseUrl"}),": your github pages repo name"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"projectName"}),": your github pages repo name"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"organizationName"}),": your github username"]}),"\n"]}),"\n",(0,t.jsx)(n.admonition,{type:"warning",children:(0,t.jsx)(n.p,{children:"GitHub Pages adds a trailing slash to Docusaurus URLs by default. It is recommended to set a trailingSlash config (true or false, not undefined)."})}),"\n",(0,t.jsx)(n.p,{children:"For example:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-js",children:'export default {\n  // ...\n  url: "https://xremagix.github.io",\n  baseUrl: "/renote/",\n  projectName: "renote",\n  organizationName: "xREMAGIx",\n  trailingSlash: false,\n  // ...\n};\n'})}),"\n",(0,t.jsx)(n.h3,{id:"deploy",children:"Deploy"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"GIT_USER=<GITHUB_USERNAME> yarn deploy\n"})}),"\n",(0,t.jsxs)(n.admonition,{type:"note",children:[(0,t.jsxs)(n.p,{children:["By default, Docusaurus uses HTTPS to deploy to GitHub Pages. Since Github change from password to ",(0,t.jsx)(n.strong,{children:"personal access token (PAT)"}),", you need to create a personal access token and use it as password when deploy.\nMore information: ",(0,t.jsx)(n.a,{href:"https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token",children:"GitHub-Create a personal access token"})]}),(0,t.jsxs)(n.p,{children:["So for convinience, I use SSH to deploy to GitHub Pages. By setting ",(0,t.jsx)(n.code,{children:"USE_SSH=true"}),", Docusaurus will use SSH to deploy."]})]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"USE_SSH=true yarn deploy\n"})}),"\n",(0,t.jsx)(n.p,{children:"For example:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"USE_SSH=true yarn deploy\n"})}),"\n",(0,t.jsx)(n.h3,{id:"triggering-deployment-with-github-actions",children:"Triggering deployment with GitHub Actions"}),"\n",(0,t.jsxs)(n.admonition,{type:"info",children:[(0,t.jsxs)(n.p,{children:["My source repo and deployment repo are the ",(0,t.jsx)(n.strong,{children:"same"})," repository."]}),(0,t.jsxs)(n.p,{children:["For more information: ",(0,t.jsx)(n.a,{href:"https://docusaurus.io/docs/deployment#triggering-deployment-with-github-actions",children:"GitHub-Triggering deployment with GitHub Actions"})]})]}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["Create a new file named ",(0,t.jsx)(n.code,{children:".github/workflows/deploy.yml"})," with the following content:"]}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yml",children:"name: Deploy to GitHub Pages\n\non:\n  push:\n    branches:\n      - main\n    # Review gh actions docs if you want to further define triggers, paths, etc\n    # https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#on\n\npermissions:\n  contents: write\n\njobs:\n  deploy:\n    name: Deploy to GitHub Pages\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - uses: actions/setup-node@v3\n        with:\n          node-version: 18\n          cache: yarn\n\n      - name: Install dependencies\n        run: yarn install --frozen-lockfile\n      - name: Build website\n        run: yarn build\n\n      # Popular action to deploy to GitHub Pages:\n      # Docs: https://github.com/peaceiris/actions-gh-pages#%EF%B8%8F-docusaurus\n      - name: Deploy to GitHub Pages\n        uses: peaceiris/actions-gh-pages@v3\n        with:\n          github_token: ${{ secrets.GITHUB_TOKEN }}\n          # Build output to publish to the `gh-pages` branch:\n          publish_dir: ./build\n          # The following lines assign commit authorship to the official\n          # GH-Actions bot for deploys to `gh-pages` branch:\n          # https://github.com/actions/checkout/issues/13#issuecomment-724415212\n          # The GH actions bot is used by default if you didn't specify the two fields.\n          # You can swap them out with your own user credentials.\n          user_name: github-actions[bot]\n          user_email: 41898282+github-actions[bot]@users.noreply.github.com\n"})}),"\n",(0,t.jsxs)(n.ol,{start:"2",children:["\n",(0,t.jsxs)(n.li,{children:["Create a new file named ",(0,t.jsx)(n.code,{children:".github/workflows/test-deploy.yml"})," with the following content:"]}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yml",children:"name: Test deployment\n\non:\n  pull_request:\n    branches:\n      - main\n    # Review gh actions docs if you want to further define triggers, paths, etc\n    # https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#on\n\njobs:\n  test-deploy:\n    name: Test deployment\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - uses: actions/setup-node@v3\n        with:\n          node-version: 18\n          cache: yarn\n\n      - name: Install dependencies\n        run: yarn install --frozen-lockfile\n      - name: Test build website\n        run: yarn build\n"})}),"\n",(0,t.jsxs)(n.ol,{start:"3",children:["\n",(0,t.jsx)(n.li,{children:"Commit and push the changes to your repository."}),"\n"]})]})}function d(e={}){const{wrapper:n}={...(0,o.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},1151:(e,n,s)=>{s.d(n,{Z:()=>a,a:()=>r});var t=s(7294);const o={},i=t.createContext(o);function r(e){const n=t.useContext(i);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:r(e.components),t.createElement(i.Provider,{value:n},e.children)}}}]);