# How it works
> This part deals with some more complex working principles. General users can jump to read [Quick Start](/quick-start).

## Interprocess communication

Parabox relies on a **client** to work in conjunction with a **plugin**. Running it alone won't work.

Clients and plugins run in separate processes. Communication between different processes relies on [**Messenger**](https://developer.android.com/reference/android/os/Messenger). The plug-in acts as the server, the client acts as the client, and the client can connect to multiple plug-ins at the same time. In general, when the client starts, Parabox performs the following operations in sequence:

1. Use IntentFilter to filter out the plug-ins that meet the specification and add them to the temporary plug-in list.
2. Perform the bindService operation on the plug-ins in the list in turn.
3. For the plug-in successfully connected, the client sends an initialization request. The plug-in is initialized according to the request and combined with the current running state (such as starting the service).
4. Every time the plug-in changes state (start, stop, pause, resume, etc.), it will send a notification to the client. The client updates the plug-in status display according to the notification content. This status monitoring will continue for the entire run cycle.
5. When the plugin returns a status of running, the client considers it a stable connection.

The above processes have been encapsulated into methods that can be easily called, and developers do not need to care about the details.

> In particular, for every **REQUEST** that is received, the verification is required to be sent back with a timestamp. Requests that do not return within a timeout will be considered invalid and return a timeout error.
>
> **NOTIFICATION** does not require postback verification, but still requires a timestamp.
>
>All encapsulation methods in the development kit, including message sending/receiving, status update, setting item update, etc., use the above two methods to communicate.

## Message caching

Messages may be lost due to special reasons such as poor connection, client service being killed, etc. To avoid this situation, Parabox provides a caching mechanism for messages to be received.

Each message is communicated internally using the **REQUEST** method. The plugin maintains a buffer queue of pending messages. The plugin removes all messages from the queue and tries to send them to the client. If the message is successfully received and stored by the client, the client will send a confirmation loopback verification to the plugin, otherwise, it will send a loopback verification with an error code. If the plug-in receives the confirmation of the return verification, the current transmission is successful and it will be removed from the queue; if an error is received or a timeout error is triggered, the message will be re-added to the to-be-received message buffer queue, waiting for the next transmission. If an error is received multiple times, it is judged that the client is disconnected, and the above loop is suspended until the client reconnects and triggers a refresh.

If the plugin service is killed, the caching mechanism will fail and messages will be lost.

The above processes have been encapsulated into methods that can be easily called, and developers do not need to care about the details.

## FCM

Due to the inherent defects of the cross-process communication method, the plug-in and the client need to keep the service running at the same time to ensure smooth communication. (Plugin service is used for message reception, client service is used for notification push and database insertion)

Through FCM, users can first choose to run the above services on other devices (such as standby machines), and then transmit message packets to the main machine through FCM. Since the FCM message reception is maintained by the system, no additional background services need to be run on the main machine, so that the cost of message reception can be passed on.

## Database

Parabox mainly maintains four types of data: **Contact, Message, File, PluginConnection**. Each type of data has its own unique id, which is provided by the plugin. In the actual storage, the plug-in id is usually attached to distinguish the data of different plug-ins. Each type also has a common type (Model) and an entity type (Entity).

|Data Type|Content|Remarks|
|-|-|-|
|Contact|Abstraction of contacts (does not distinguish between groups and private chats), including account information such as name, avatar and various configuration information| many-to-many binding with PluginConnection |
|Message|Abstract of message, including message content, sender account information|One-to-one binding with connection|
|File|Abstraction of files, including file name, file size, file type, download/backup method, etc. |One-to-one binding with messages|
|PluginConnection|The connection information between the plug-in and the client, mainly including the connection data required for sending messages. Also used to determine session type | many-to-many binding with sessions |

For more implementation details, please read [Developer Documentation](/en/developer).