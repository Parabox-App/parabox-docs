# Developer Documentation

Welcome to the developer documentation. The necessary guidelines and resources for developing Parabox plugins are included here.

Plug-ins are one of the core concepts of Parabox, they can provide Parabox with a variety of sources of information. Parabox itself does not provide information sources, but implements these functions through plug-ins.

## Development environment

### development tools

Android Studio Chipmunk | 2021.2.1 or later

- [Android Studio](https://developer.android.com/studio)

### Development language

- [Kotlin](https://kotlinlang.org/)

## Start with template project

We provide a template project. The template project contains the SDK and completes the basic schema setup. You can quickly start developing your plugin from it.

### Download template project

Use the following command to clone the [GitHub]() repository:
```bash
$ git clone https://github.com/ojhdt/parabox-extension-example.git
````
Or download the zip file: [Download]()

### Architecture overview
The following shows the directory structure under `app/src/main`:

```
main:
│  AndroidManifest.xml
├─java
│  └─com
│      └─parabox
│          └─example
│              │  MainActivity.kt                // *Core Activity
│              ├─core
│              │  │  HiltApplication.kt          // Dagger-hilt
│              │  └─util
│              │          DataStore.kt           // DataStore to store plugin settings
│              │          NotificationUtil.kt    // Foreground Service Notification
│              ├─domain
│              │  ├─service
│              │  │      ConnService.kt          // *Core Service
│              │  └─util
│              │          CustomKey.kt           // Constants used by the connector
│              │          ServiceStatus.kt       // Service status encapsulation for front-end display
│              └─ui
│                  ├─main
│                  │      MainScreen.kt          // Composable
│                  │      MainViewModel.kt       // ViewModel
│                  ├─theme
│                  │      Color.kt
│                  │      Theme.kt
│                  │      Type.kt
│                  └─util
│                          Preference.kt         // Preference Composable
└─res  
    ├─values
    │      colors.xml
    │      strings.xml                           // String Resource
    │      themes.xml
    └─xml
            backup_rules.xml
            data_extraction_rules.xml
            
```

>Note: **ConnService** path and naming are strictly limited, please do not move or rename.

Plugin functionality is undertaken by ``MainActivity`` (inherited from ParaboxActivity) and ``ConnService`` (inherited from ParaboxService).

``MainActivity`` is used to display the main interface of the plugin and provide users with interactive control over the service. The interface is built using Compose.

``ConnService`` plays the role of the server, on the one hand, it is bound to the Parabox background service and undertakes the task of communicating with the master. On the other hand, it is bound to MainActivity to provide running status updates to the main interface. This means that any communication between MainActivity and Parabox must go through it. It is also the core unit for receiving and sending messages from various platforms.

To reduce complexity and aid understanding, this project only references necessary dependencies. If you need navigation, data persistence or more, you can add ``Navigation``, ``Room``, etc.

|dependencies|uses|
|---|:---|
|Parabox Development Kit|Parabox Extension Development Kit|
|[Hilt](https://developer.android.com/training/dependency-injection/hilt-android)|Dependency Injection Library|
|[DataStore](https://developer.android.com/topic/libraries/architecture/datastore)|Key-value store|
|[ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel)|Architecture|

### Configuration

In this template project, the necessary changes you need to make are marked with ``// TODO``. A little trick is to open the TODO window in Android Studio and go through each TODO comment in turn and make changes.

1\. Click on TODO 1 in the TODO window, located in build.gradle. Replace ``com.parabox.example`` with your package name. You need to use the Rename function to change the directory tree name synchronously.
```kotlin
android {
//    TODO 1 : Set your extension's Package Name.
    namespace 'com.android.myextension'
    compileSdk 33

    defaultConfig {
        applicationId "com.android.myextension"
        minSdk 26
        targetSdk 33
        versionCode 1
        versionName "1.0"

        ...
    }
    ...
}
```

2\. Click TODO 2 in the TODO window, which is located in AndroidManifest.xml. Update the ``connection_type`` and ``connection_name`` values. And update ``android:label`` to your plugin name.

``connection_type`` needs to be filled with Int type. This value is used to distinguish different plug-ins. Please ensure that this value is unique among the installed plug-ins.

``connection_name`` needs to be filled in String type. This value is used to display the plugin name on the main app.

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">
    ...

    <application
        ...

        android:label="@string/my_app_name"
        ...
        >

        <!-- TODO 2: Set your extension's Type and Name here.-->
        <meta-data android:name="connection_type" android:value="1234"/>
        <meta-data android:name="connection_name" android:value="Extension"/>
        ...
    </application>
</manifest>
```

3\. Click TODO 2-1 in the TODO window, which is located in AndroidManifest.xml. Configure basic information (profile, developer, etc.) for your plugin. At the same time, the numbers `0, 1 and 2` describe the plugin's support for six basic message contents. **`0` means no support, `1` means receive only, `2` means full support (receive and send)**. The configuration will be displayed on the `Extensions` settings page. (Added in v.1.0.5-beta)

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">
    ...

    <application
        ...
        <!-- TODO 2-1: Configure basic information for your extension-->
        <meta-data android:name="author" android:value="Parabox"/>
        <meta-data android:name="description" android:value="Parabox Extension Example"/>
        <meta-data android:name="plain_text_support" android:value="1"/>
        <meta-data android:name="image_support" android:value="0"/>
        <meta-data android:name="audio_support" android:value="0"/>
        <meta-data android:name="file_support" android:value="0"/>
        <meta-data android:name="at_support" android:value="0"/>
        <meta-data android:name="quote_reply_support" android:value="0"/>
        ...
    </application>
</manifest>
```
4\. Compile and install the app to your test device. If all goes well, your plugin should be discoverable and displayed in the main app. The plug-in information will be displayed in the status detection dialog of the home page and the extension category of the settings page (if not, try restarting the main app). Try to start the service, the service status displayed on the main app will be updated in time.

Click "Send a test message" in the test area, and the main app should receive the message from the plugin. After the master responds, the text of the reply message should pop up with ``Snackbar`` on the interface of the plugin. The mechanism of operation here will be explained later.

### Development Guidelines
Click on TODO 3 in the TODO window, which is located in ConnService.kt. In the ``onStartParabox`` method, delete the sample implementation and write your own service startup code. As the example implementation demonstrates, you can use the ``updateServiceState`` method to update the service state while startup is in progress. Optional service states include ``STOP`` , ``PAUSE`` , ``ERROR`` , ``LOADING`` , ``RUNNING``. Status updates will be instantly reflected to the front end.

```kotlin
lifecycleScope.launch {

// TODO 3: Delete the code below, then write your own startup process
    updateServiceState(ParaboxKey.STATE_LOADING, "Step A")
    delay(1000)
    updateServiceState(ParaboxKey.STATE_LOADING, "Step B")
    delay(1000)
    updateServiceState(ParaboxKey.STATE_PAUSE, "Step C")
    delay(1000)
    updateServiceState(ParaboxKey.STATE_LOADING, "Step D")
    delay(1000)
    updateServiceState(ParaboxKey.STATE_RUNNING, "Step E")
}

```

Then choose to implement some of other abstract methods such as ``customHandleMessage``, ``onMainAppLaunch``, ``onRecallMessage`` according to your needs. For details, please refer to the development kit documentation.

### Communication Mechanism

The Parabox plug-in communication mechanism is based on [Messenger]((https://developer.android.com/reference/android/os/Messenger)), and the development kit has carried out the necessary encapsulation. According to the communication object, whether or not to send back authentication is divided into three categories: ``Request``, ``COMMAND`` and ``NOTIFICATION``.

|Type|Send With|Respond With|Sender|Responder|
|----|----|----|----|----|
|Request (Request)|``sendRequest``|``sendRequestResponse``|ParaboxService|ParaboxActivity or master|
|command(COMMAND)|``sendCommand``|``sendCommandResponse``|ParaboxActivity or master |ParaboxService|
|Notification (NOTIFICATION)|``sendNotification``|``-``|ParaboxActivity, ParaboxService, or master|-|

``Request``, ``COMMAND`` have their own loopback authentication and timeout mechanisms. It is guaranteed that each communication must trigger the ``onResult`` callback within the timeout period. The returned ``ParaboxResult`` carries the data returned by the request successfully or the error code returned by the request failure. Often used for logic that needs to be sure to get a reply before proceeding. Such as message sending/receiving, updating configuration, etc.

The internal implementation of ``Request`` and ``COMMAND`` uses Kotlin coroutines, such as using [CompletableDeferred](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core /kotlinx.coroutines/-completable-deferred/) implements pending wait. If the callback method is not suitable for your development needs, you can also rewrite it in the form of a suspending function through simple encapsulation:

```kotlin
suspend fun sendRequest(
    request: Int,
    client: Int,
    extra: Bundle,
    timeoutMillis: Long,
) : ParaboxResult {
    return suspendCoroutine<ParaboxResult> { cont ->
        sendRequest(
            request = request,
            client = client,
            extra = extra,
            timeoutMillis = timeoutMillis,
        ) {
            if (it is ParaboxResult.Success) {
                cont.resume(it)
            } else {
                val errorCode = (it as ParaboxResult.Fail).errorCode
                cont.resumeWithException(Exception("$errorCode"))
            }
        }
    }
}
```

The transmission method and processing logic of ``Request`` and ``COMMAND`` are basically the same, only the sender and the responder differ. ``sendRequest`` also needs to provide an additional target parameter. Since there is usually a host and ParaboxActivity connected to ParaboxService at the same time, it can be specified by passing ``CLIENT_MAIN_APP`` or ``CLIENT_CONTROLLER`` for the `client` parameter.

``NOTIFICATION`` is initiated by either party and does not require a reply. There is no guarantee that the recipient will receive it successfully. Often used for logic that is sent frequently and does not require a reply. Such as logs, status updates, etc.

To help you quickly understand the communication mechanism of the plug-in, this project provides two simple examples: **send a message to Parabox from the main interface of the plug-in** (this is not common, the message is usually received from the Service and then delivered to the client), And **send a message from Parabox to the main interface of the plug-in** (the result here is a Toast popping up), the example shows two different forms of transmission and transmission in different directions.

#### Communication that requires loopback authentication (take command as an example)

1\. Click TODO 4 in the TODO window and declare an Int constant that identifies the ``command``. In this case ``COMMAND_RECEIVE_TEST_MESSAGE`` in ``CustomKey``.

```kotlin
object CustomKey {
    // TODO 4: Added static Key constants for commands
    const val COMMAND_RECEIVE_TEST_MESSAGE = 9999
}

````

2\. Click on TODO 5 in the TODO window, browse the ``receiveTestMessage`` implementation, and learn how to use ``sendCommand`` to pass in command constants, carry extra data, and send commands.

```kotlin
fun receiveTestMessage() {
    // TODO 5 : Call sendCommand function with COMMAND_RECEIVE_TEST_MESSAGE
    sendCommand(
        command = CustomKey.COMMAND_RECEIVE_TEST_MESSAGE,
        extra = Bundle().apply {
            putString("content", "...")
        },
        timeoutMillis = 3000,
        onResult = {
            ...
        })
    }
````

3\. Click TODO 6 in the TODO window, browse the ``customHandleMessage`` implementation, and learn how to use ``msg.what`` to identify the command type and call the corresponding method. Additional data to carry is available from `msg.obj`. To call `sendCommandResponse` later, pass in `metadata` as a parameter.

```kotlin
override fun customHandleMessage(msg: Message, metadata: ParaboxMetadata) {
    when (msg.what) {
        // TODO 6: Handle custom command
        CustomKey.COMMAND_RECEIVE_TEST_MESSAGE -> {
            receiveTestMessage(msg, metadata)
        }
    }
}
````

4\. Click on TODO 7 in the TODO window and browse the ``receiveTestMessage`` implementation to learn how to use ``sendCommandResponse`` to send back the command result. If `sendCommandResponse` is not called, the timeout mechanism of the original command will be triggered and ``ParaboxResult`` with ``ERROR_TIMEOUT`` will be returned.

```kotlin
private fun receiveTestMessage(msg: Message, metadata: ParaboxMetadata) {

    ...
    // TODO 7 : Call sendCommandResponse when the job is done
    if (it is ParaboxResult.Success) {
        sendCommandResponse(
            isSuccess = true,
            metadata = metadata,
            extra = Bundle().apply {
                putString(
                    "message",
                    "Message received at ${System.currentTimeMillis()}"
                )
            }
        )
    } else {
        sendCommandResponse(
            isSuccess = false,
            metadata = metadata,
            errorCode = (it as ParaboxResult.Fail).errorCode
        )
    }
}
````

5\. After finishing the above process, delete the sample code.

#### One-way one-way communication (take notification as an example)

1\. Click TODO 8 in the TODO window and declare an Int constant that identifies the command. In this case, ``NOTIFICATION_SHOW_TEST_MESSAGE_SNACKBAR`` in ``CustomKey``.

```kotlin
object CustomKey {
    // TODO 8: Added static Key constants for notifications
    const val NOTIFICATION_SHOW_TEST_MESSAGE_SNACKBAR = 9998
}
````

2\. Click on TODO 9 in the TODO window, browse the ``showTestMessageSnackbar`` implementation, and learn how to use ``sendNotification`` to pass in notification constants, carry extra data, and send notifications.

```kotlin
// TODO 9 : Call sendNotification function with NOTIFICATION_SHOW_TEST_MESSAGE_SNACKBAR
private fun showTestMessageSnackbar(message: String) {
    sendNotification(CustomKey.NOTIFICATION_SHOW_TEST_MESSAGE_SNACKBAR, Bundle().apply {
        putString("message", message)
    })
}
````

3\. Click TODO 10 in the TODO window, browse the ``customHandleMessage`` implementation, and learn how to use ``msg.what`` to identify the notification type and call the corresponding method. Additional data to carry is available from `msg.obj`. Since there is no loopback, there is no need to pass in `metadata`.

```kotlin
override fun customHandleMessage(msg: Message, metadata: ParaboxMetadata) {
    when(msg.what){
        // TODO 10: Handle custom notification
        CustomKey.NOTIFICATION_SHOW_TEST_MESSAGE_SNACKBAR -> {
            (msg.obj as Bundle).getString("message")?.also {
                showTestMessageSnackbar(it)
            }
        }
    }
}
````

4\. After finishing the above process, delete the sample code.

And for common communication use cases, the SDK has been packaged into easy-to-call methods. Its internal implementation still uses ``REQUEST`` , ``COMMAND`` and ``NOTIFICATION``. Please refer to [Common Use Cases](/en/developer/#_11).

### Common Use Cases

#### Receive message

`Receive message` takes the Parabox main side as the perspective, that is, the process that the plug-in receives the message from the message source and delivers it to the main side. The SDK provides the ``receiveMessage`` method for this use case. The key to using this method is to generate an instance of `ReceiveMessageDto`.

|parameters|description|
|---|---|
List of |contents|MessageContents. For details, please refer to [Message Pack]()|
Instance of |profile|Profile. Describe the sender information of the current message, including nickname, avatar, etc. The id must be unique and used to identify the sender when @. |
Instance of |subjectProfile|Profile. Information describing the session to which the current message belongs. For private chat sessions, this value is the same as profile. For group chat, it can be used to describe group chat information, including nickname, avatar, etc. id needs to be unique to uniquely identify the current session|
|timestamp|message reception time timestamp|
|messageId| needs to be unique to uniquely identify the message. It is allowed to be empty, and the database will automatically assign an id to it, but emptying it will cause message recall, cache mechanism, etc. to fail. |
|pluginConnection| is used to describe the connection information of the session to which this message belongs. Please refer to the table below in combination |

|parameters|description|
|---|---|
|connectionType| must be the same as the META_DATA declaration value in AndroidManifest.xml. For the acquisition method, please refer to the sample project. |
|sendTargetType| Describes the current session type. Optional `SendTargetType.USER` or `SendTargetType.GROUP`|
|id| is used to uniquely identify the current session. It needs to be consistent with the id in the subjectProfile in the above table|

```kotlin
private fun receiveTestMessage(msg: Message, metadata: ParaboxMetadata) {
    // TODO 11 : Receive Message
    val contactId = 1L
    val profile = Profile(
        name = "anonymous",
        avatar = "https://gravatar.loli.net/avatar/d41d8cd98f00b204e9800998ecf8427e?d=mp&v=1.5.1",
        id = contactId
    )
    receiveMessage(
        ReceiveMessageDto(
            contents = listOf(PlainText(text = "content")),
            profile = profile,
            subjectProfile = profile,
            timestamp = System.currentTimeMillis(),
            messageId = null,
            pluginConnection = PluginConnection(
                connectionType = connectionType,
                sendTargetType = SendTargetType.USER,
                id = contactId
            )
        ),
        onResult = {
            ...
        }
    )
}
```

The execution result of the above code should be shown as below:

![message received](../images/1.png)

#### Send a message

The SDK provides the ``onSendMessage`` method for this use case. The key to using this method is to get the required information from the only parameter `SendMessageDto`.

|parameters|description|
|----|----|
List of |contents|MessageContents. For details, please refer to [Message Pack]()|
|timestamp|message sending time timestamp|
|pluginConnection| is used to describe the connection information of the session to which this message belongs. Please refer to the table above in combination |
|messageId| Uniquely identifies this message and is generated by the system. It is recommended to temporarily save as a map to recall this message|


The method is a suspend function. Returns `true` after confirming that the sending is complete, otherwise returns `false`.

#### Withdraw a message

The SDK provides the ``onRecallMessage`` method for this use case. Only one parameter of messageId is provided, which needs to be used together with the messageId saved when sending the message.

The method is a suspend function. After confirming that the withdrawal is successful, return `true`, otherwise return `false`. If retraction is not supported, `false` can also be returned directly.

## From Scratch

To learn how to use the toolkit, please refer to [Development Kit Documentation](/en/parabox-development-kit).