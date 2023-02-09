import{_ as a,M as s,p as o,q as r,R as e,t,N as c,a1 as n}from"./framework-204010b2.js";const d={},h=n('<h1 id="how-it-works" tabindex="-1"><a class="header-anchor" href="#how-it-works" aria-hidden="true">#</a> How it works</h1><blockquote><p>This part deals with some more complex working principles. General users can jump to read <a href="/quick-start">Quick Start</a>.</p></blockquote><h2 id="interprocess-communication" tabindex="-1"><a class="header-anchor" href="#interprocess-communication" aria-hidden="true">#</a> Interprocess communication</h2><p>Parabox relies on a <strong>client</strong> to work in conjunction with a <strong>plugin</strong>. Running it alone won&#39;t work.</p>',4),l={href:"https://developer.android.com/reference/android/os/Messenger",target:"_blank",rel:"noopener noreferrer"},u=e("strong",null,"Messenger",-1),p=n('<ol><li>Use IntentFilter to filter out the plug-ins that meet the specification and add them to the temporary plug-in list.</li><li>Perform the bindService operation on the plug-ins in the list in turn.</li><li>For the plug-in successfully connected, the client sends an initialization request. The plug-in is initialized according to the request and combined with the current running state (such as starting the service).</li><li>Every time the plug-in changes state (start, stop, pause, resume, etc.), it will send a notification to the client. The client updates the plug-in status display according to the notification content. This status monitoring will continue for the entire run cycle.</li><li>When the plugin returns a status of running, the client considers it a stable connection.</li></ol><p>The above processes have been encapsulated into methods that can be easily called, and developers do not need to care about the details.</p><blockquote><p>In particular, for every <strong>REQUEST</strong> that is received, the verification is required to be sent back with a timestamp. Requests that do not return within a timeout will be considered invalid and return a timeout error.</p><p><strong>NOTIFICATION</strong> does not require postback verification, but still requires a timestamp.</p><p>All encapsulation methods in the development kit, including message sending/receiving, status update, setting item update, etc., use the above two methods to communicate.</p></blockquote><h2 id="message-caching" tabindex="-1"><a class="header-anchor" href="#message-caching" aria-hidden="true">#</a> Message caching</h2><p>Messages may be lost due to special reasons such as poor connection, client service being killed, etc. To avoid this situation, Parabox provides a caching mechanism for messages to be received.</p><p>Each message is communicated internally using the <strong>REQUEST</strong> method. The plugin maintains a buffer queue of pending messages. The plugin removes all messages from the queue and tries to send them to the client. If the message is successfully received and stored by the client, the client will send a confirmation loopback verification to the plugin, otherwise, it will send a loopback verification with an error code. If the plug-in receives the confirmation of the return verification, the current transmission is successful and it will be removed from the queue; if an error is received or a timeout error is triggered, the message will be re-added to the to-be-received message buffer queue, waiting for the next transmission. If an error is received multiple times, it is judged that the client is disconnected, and the above loop is suspended until the client reconnects and triggers a refresh.</p><p>If the plugin service is killed, the caching mechanism will fail and messages will be lost.</p><p>The above processes have been encapsulated into methods that can be easily called, and developers do not need to care about the details.</p><h2 id="fcm" tabindex="-1"><a class="header-anchor" href="#fcm" aria-hidden="true">#</a> FCM</h2><p>Due to the inherent defects of the cross-process communication method, the plug-in and the client need to keep the service running at the same time to ensure smooth communication. (Plugin service is used for message reception, client service is used for notification push and database insertion)</p><p>Through FCM, users can first choose to run the above services on other devices (such as standby machines), and then transmit message packets to the main machine through FCM. Since the FCM message reception is maintained by the system, no additional background services need to be run on the main machine, so that the cost of message reception can be passed on.</p><h2 id="database" tabindex="-1"><a class="header-anchor" href="#database" aria-hidden="true">#</a> Database</h2><p>Parabox mainly maintains four types of data: <strong>Contact, Message, File, PluginConnection</strong>. Each type of data has its own unique id, which is provided by the plugin. In the actual storage, the plug-in id is usually attached to distinguish the data of different plug-ins. Each type also has a common type (Model) and an entity type (Entity).</p><table><thead><tr><th>Data Type</th><th>Content</th><th>Remarks</th></tr></thead><tbody><tr><td>Contact</td><td>Abstraction of contacts (does not distinguish between groups and private chats), including account information such as name, avatar and various configuration information</td><td>many-to-many binding with PluginConnection</td></tr><tr><td>Message</td><td>Abstract of message, including message content, sender account information</td><td>One-to-one binding with connection</td></tr><tr><td>File</td><td>Abstraction of files, including file name, file size, file type, download/backup method, etc.</td><td>One-to-one binding with messages</td></tr><tr><td>PluginConnection</td><td>The connection information between the plug-in and the client, mainly including the connection data required for sending messages. Also used to determine session type</td><td>many-to-many binding with sessions</td></tr></tbody></table><p>For more implementation details, please read <a href="/en/developer">Developer Documentation</a>.</p>',15);function m(g,f){const i=s("ExternalLinkIcon");return o(),r("div",null,[h,e("p",null,[t("Clients and plugins run in separate processes. Communication between different processes relies on "),e("a",l,[u,c(i)]),t(". The plug-in acts as the server, the client acts as the client, and the client can connect to multiple plug-ins at the same time. In general, when the client starts, Parabox performs the following operations in sequence:")]),p])}const v=a(d,[["render",m],["__file","how-it-works.html.vue"]]);export{v as default};
