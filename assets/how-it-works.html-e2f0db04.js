import{_ as o,M as n,p as d,q as s,R as t,t as e,N as i,a1 as r}from"./framework-204010b2.js";const h={},c=r('<h1 id="如何工作" tabindex="-1"><a class="header-anchor" href="#如何工作" aria-hidden="true">#</a> 如何工作</h1><blockquote><p>该部分涉及较为复杂的工作原理。一般使用者可跳转阅读<a href="/quick-start">快速开始</a>。</p></blockquote><h2 id="跨进程通信" tabindex="-1"><a class="header-anchor" href="#跨进程通信" aria-hidden="true">#</a> 跨进程通信</h2><p>Parabox 依靠<strong>客户端</strong>与<strong>插件</strong>配合运行。单独一方运行无法发挥作用。</p>',4),l={href:"https://developer.android.com/reference/android/os/Messenger",target:"_blank",rel:"noopener noreferrer"},p=t("strong",null,"Messenger",-1),_=r('<ol><li>使用IntentFilter筛选出符合规范的插件，将其添加至临时插件列表。</li><li>依次对列表中插件进行bindService操作。</li><li>对于连接成功的插件，客户端发送一条初始化请求。插件根据请求，结合当前运行状态启进行初始化（如启动服务）。</li><li>插件每次发生状态变更(启动、停止、暂停、恢复等)，都会向客户端发送一条通知。客户端根据通知内容，更新插件状态显示。该状态监听将持续整个运行周期。</li><li>当插件返回状态为运行中时，客户端将其视作稳定连接。启用当前插件的消息发送出口。同时监听消息接收入口，接收来自插件的消息。</li></ol><p>以上过程都已被封装成可方便调用的方法，开发者无需关心其中细节。</p><blockquote><p>特别地，对于接收到的每一条 <strong>请求（REQUEST）</strong> ，都要求使用时间戳回送验证。超时未返回的请求将被视为无效，并返回超时错误。</p><p><strong>通知（NOTIFICATION）</strong> 则不需要回送验证，但仍要求使用时间戳。</p><p>开发工具包中所有封装方法，包括消息发送/接收，状态更新，设置项更新等，都使用以上两种方式进行通信。</p></blockquote><h2 id="待接收消息缓存机制" tabindex="-1"><a class="header-anchor" href="#待接收消息缓存机制" aria-hidden="true">#</a> 待接收消息缓存机制</h2><p>由于连接不畅，客户端服务被杀死等特殊原因，可能会导致消息丢失。为避免这种情况，Parabox 提供了待接收消息缓存机制。</p><p>每一条消息在内部使用 <strong>请求（REQUEST）</strong> 方式进行通信。插件维护一个待接收消息缓存队列。插件从队列中取出所有消息，并尝试向客户端发送，若消息被客户端成功接收并成功存入，客户端会向插件发送一条确认回送验证，反之则发送携带错误码的回送验证。若插件收到确认回送验证，则当前传输成功，将其从队列移除；若接收到错误或触发超时错误，则将消息重新加入待接收消息缓存队列，等待下一次发送。若多次收到错误，则判断客户端断联，暂停以上循环，直至客户端重新连接并触发刷新。</p><p>若插件服务被杀死，则该缓存机制失效，消息将丢失。</p><p>以上过程都已被封装成可方便调用的方法，开发者无需关心其中细节。</p><h2 id="fcm" tabindex="-1"><a class="header-anchor" href="#fcm" aria-hidden="true">#</a> FCM</h2><p>由于跨进程通信方法的固有缺陷，插件与客户端需同时保持服务运行，以保证通信畅通。（插件服务用作消息接收，客户端服务用作通知推送和数据库插入）</p><p>通过 FCM ，用户可先选择将以上服务运行于其他设备（如备用机），再将消息包通过FCM传输至主力机。由于FCM消息接收由系统维护，主力机上不再需要额外运行任何后台服务，从而实现消息接收成本转嫁。</p><h2 id="数据存储" tabindex="-1"><a class="header-anchor" href="#数据存储" aria-hidden="true">#</a> 数据存储</h2><p>Parabox 主要维护四类数据：<strong>会话（Contact）、消息（Message）、文件（File），连接（PluginConnection）</strong>。每类数据都具有单独的专属id，由插件提供。在实际存储中，通常还附加上插件id，以区分不同插件的数据。每种类型也具有普通类型（Model）与实体类型（Entity）。</p><table><thead><tr><th>数据类型</th><th>内容</th><th>备注</th></tr></thead><tbody><tr><td>会话（Contact）</td><td>联系人的抽象（不区分群组与私聊），包含名称，头像等账户信息和各种配置信息</td><td>与连接多对多绑定</td></tr><tr><td>消息（Message）</td><td>消息的抽象，包含消息内容，发送者账户信息</td><td>与连接一对一绑定</td></tr><tr><td>文件（File）</td><td>文件的抽象，包含文件名，文件大小，文件类型，下载/备份方式等信息</td><td>与消息一对一绑定</td></tr><tr><td>连接（PluginConnection）</td><td>插件与客户端的连接信息，主要包含发送消息时所需的连接数据。也用作判断会话类型</td><td>与会话多对多绑定</td></tr></tbody></table><p>更多实现细节，请跳转阅读<a href="/developer">开发者文档</a>。</p>',15);function g(b,f){const a=n("ExternalLinkIcon");return d(),s("div",null,[c,t("p",null,[e("客户端与插件分别运行在不同进程中。不同进程间依靠 "),t("a",l,[p,i(a)]),e(" 进行通信。插件扮演服务端，主端扮演客户端，客户端可同时连接多个插件。一般情况下，客户端启动时，Parabox 依次执行以下操作：")]),_])}const x=o(h,[["render",g],["__file","how-it-works.html.vue"]]);export{x as default};
