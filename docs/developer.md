# 开发者文档

欢迎来到开发者文档。这里包含了开发 Parabox 插件的必要指引和资源。

插件是 Parabox 的核心概念之一，它们可以为 Parabox 提供多样化的信息源。Parabox 本身并不提供信息源，而是通过插件来实现这些功能。

## 开发环境

### 开发工具

Android Studio Chipmunk | 2021.2.1 或更高版本

- [Android Studio](https://developer.android.com/studio)

### 开发语言

- [Kotlin](https://kotlinlang.org/)

## 从模板项目开始

我们提供了一个模板项目。模板项目包含了开发工具包，并完成了基本的架构设置。你可以从中快速开始开发你的插件。

### 下载模板项目

从命令行使用下列命令克隆 [GitHub]() 代码库：
```bash
$ git clone https://github.com/ojhdt/parabox-extension-example.git
```
或者下载 zip 文件 ：

### 架构概览
以下展示``app\src\main``下的目录结构：
```text
main:
│  AndroidManifest.xml
├─java
│  └─com
│      └─parabox
│          └─example
│              │  MainActivity.kt                // *核心活动
│              ├─core
│              │  │  HiltApplication.kt          // Dagger-hilt
│              │  └─util
│              │          DataStore.kt           // 存储插件设置的DataStore
│              │          NotificationUtil.kt    // 前台服务所需的通知
│              ├─domain
│              │  ├─service
│              │  │      ConnService.kt          // *核心服务
│              │  └─util
│              │          CustomKey.kt           // 连接器使用的自定义常量
│              │          ServiceStatus.kt       // 服务状态封装，用于前端显示
│              └─ui
│                  ├─main
│                  │      MainScreen.kt          // 插件主界面Composable
│                  │      MainViewModel.kt       // 插件主界面ViewModel
│                  ├─theme
│                  │      Color.kt
│                  │      Theme.kt
│                  │      Type.kt
│                  └─util
│                          Preference.kt         // 设置块Composable
└─res  
    ├─values
    │      colors.xml
    │      strings.xml                           // 字符串资源
    │      themes.xml
    └─xml
            backup_rules.xml
            data_extraction_rules.xml
            
```

>注意：**ConnService**路径及命名存在严格限定，请勿移动或更名。

插件功能由``MainActivity``（继承自ParaboxActivity）和``ConnService``（继承自ParaboxService）承担。

``MainActivity``用于展示插件主界面，为用户提供对服务可交互的控制。界面使用Compose构建。

``ConnService``扮演服务器的角色，一方面与Parabox后台服务绑定，承担与主端通信的任务。另一方面与MainActivity绑定，向主界面提供运行状态更新。这意味着任何MainActivity与Parabox的通信必须经由它处理。它同时也是对接各平台消息接收及发送的核心单元。

为降低复杂程度及帮助理解，该项目仅引用了必要依赖库。若有导航，数据持久化等需求，可自行添加 ``Navigation``，``Room``等。

|依赖|用途|
|---|:---|
|Parabox Development Kit|Parabox插件开发工具包|
|[Hilt](https://developer.android.com/training/dependency-injection/hilt-android)|依赖项注入库|
|[DataStore](https://developer.android.com/topic/libraries/architecture/datastore)|键值对存储|
|[ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel)|架构组件|

### 配置

在本模板项目中，你需要做出的必要修改都以 ``// TODO`` 标记。一个小技巧是在 Android Studio 中打开 TODO 工具窗口，然后依次浏览每个 TODO 注释，并作出修改。

1\. 点击 TODO 工具窗口中的 TODO 1，它位于 build.gradle 中。将 ``com.parabox.example`` 替换为你的包名。需同步使用 Rename 功能更改目录树名称。
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

2\. 点击 TODO 工具窗口中的 TODO 2，它位于 AndroidManifest.xml 中。更新 ``connection_type`` 及 ``connection_name`` 的值。并更新 ``android:label`` 为你的插件名称。

``connection_type`` 需要填入 Int 类型。该值用于区分不同插件，请注意保证该值在本机已安装插件中的唯一性。

``connection_name`` 需要填入 String 类型。该值用于在主端显示插件名称。

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
3\. 编译，并将应用安装至测试设备。若一切正常，您的插件应能被主端发现及显示。插件信息将显示于主页的状态检测对话框和设置页面的扩展类别（若未显示，可尝试重启主端）。点击插件图标，即可跳转插件主界面。尝试启动服务，服务状态会被即时更新至插件主界面和 Parabox 主端。

点击测试区域中的``发送测试消息``，主端应接收到来自插件的消息。主端回复后，回复消息文字应在插件主界面以 ``Snackbar`` 弹出。稍后将解释该处运作机制。


### 开发指引
点击 TODO 工具窗口中的 TODO 3，它位于 ConnService.kt 中。于 ``onStartParabox`` 方法中，删除示例实现，并编写你自己的服务启动代码。正如示例实现所展示，你可以在启动进行时使用 ``updateServiceState`` 方法更新服务状态。可选的服务状态包括 ``STOP`` , ``PAUSE`` , ``ERROR`` , ``LOADING`` , ``RUNNING``。状态更新将会被即时反映至前端。

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

随后根据需求选择替换如 ``customHandleMessage``， ``onMainAppLaunch``， ``onRecallMessage`` 等其他抽象方法的空实现。具体使用请参考开发工具包文档。

### 通信机制

Parabox 插件通信机制基于 [Messenger]((https://developer.android.com/reference/android/os/Messenger)) ，开发工具包进行了必要的封装。根据通信对象，是否需要回送验证分为 ``请求（Request）``， ``命令（COMMAND）`` ， ``通知（NOTIFICATION）`` 三类。

|类型|发送命令|发送回复|发送者|回复者|
|----|----|----|----|----|
|请求（Request）|``sendRequest``|``sendRequestResponse``|ParaboxService|ParaboxActivity或主端|
|命令（COMMAND）|``sendCommand``|``sendCommandResponse``|ParaboxActivity或主端|ParaboxService|
|通知（NOTIFICATION）|``sendNotification``|``-``|ParaboxActivity，ParaboxService或主端|-|

``请求（Request）``， ``命令（COMMAND）`` 自带回送验证及超时机制。保证每一次通信都必然在超时时间内触发 ``onRequest`` 回调。返回的 ``ParaboxResult`` 携带请求成功返回的数据或请求失败返回的错误码。常用于需要确定得到回复才能继续进行的逻辑。如消息发送/接收，更新配置等。

``请求（Request）``和 ``命令（COMMAND）`` 内部实现部分使用 Kotlin 协程，如使用 [CompletableDeferred](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-completable-deferred/) 实现挂起等待。如果回调方式不适用于您的开发需求，您也可以通过简单的封装改写成挂起函数形式：

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

``请求（Request）``和 ``命令（COMMAND）``的传输方式和处理逻辑基本相同，仅在发送者和回复者上有所区别。``sendRequest`` 还需要额外提供目标参数，由于通常同时存在主端与 ParaboxActivity 连接 ParaboxService， 可通过为 `client` 参数传递 ``CLIENT_MAIN_APP`` 或 ``CLIENT_CONTROLLER`` 指定。

``通知（NOTIFICATION）``由任意一方发起，不需要回复。对接收方是否成功接收不提供保证。常用于发送频繁，不需要回复的逻辑。如日志，状态更新等。

为帮助您快速理解插件的通信机制，本项目提供了两个简单的示例：**从插件主界面向 Parabox 发送消息**（这并不常见，消息通常从Service接收后传递至客户端），以及**从 Parabox 向插件主界面发送消息**（此处结果为弹出一个Toast），示例展示了两种不同形式的传输及不同方向的传输。

#### 要求回送验证的通信（以 command 为例）

1\. 点击 TODO 工具窗口中的 TODO 4，声明一个用于识别命令的 Int 常量。本例中为 ``CustomKey`` 中的 ``COMMAND_RECEIVE_TEST_MESSAGE``。

```kotlin
object CustomKey {
    // TODO 4: Added static Key constants for commands
    const val COMMAND_RECEIVE_TEST_MESSAGE = 9999
}

```

2\. 点击 TODO 工具窗口中的 TODO 5，浏览 ``receiveTestMessage`` 实现，了解如何使用 ``sendCommand`` 传入命令常量，携带额外数据并发送命令。

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
```

3\. 点击 TODO 工具窗口中的 TODO 6，浏览 ``customHandleMessage`` 实现，了解如何使用 ``msg.what`` 分辨命令类型，并调用对应方法。携带的额外数据可从 `msg.obj` 获得。为了稍后调用 `sendCommandResponse`， 请将 `metadata` 作为参数传入。

```kotlin
override fun customHandleMessage(msg: Message, metadata: ParaboxMetadata) {
    when (msg.what) {
        // TODO 6: Handle custom command
        CustomKey.COMMAND_RECEIVE_TEST_MESSAGE -> {
            receiveTestMessage(msg, metadata)
        }
    }
}
```

4\. 点击 TODO 工具窗口中的 TODO 7，浏览 ``receiveTestMessage`` 实现，了解如何使用 ``sendCommandResponse`` 回送命令结果。若 `sendCommandResponse` 未被调用，原 command 的超时机制将被触发并返回携带 ``ERROR_TIMEOUT`` 的 ``ParaboxResult``。

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
```

5\. 了解以上流程后，删除示例代码。

#### 单次单向通信（以 notification 为例）

1\. 点击 TODO 工具窗口中的 TODO 8，声明一个用于识别命令的 Int 常量。本例中为 ``CustomKey`` 中的 ``NOTIFICATION_SHOW_TEST_MESSAGE_SNACKBAR``。

```kotlin
object CustomKey {
    // TODO 8: Added static Key constants for notifications
    const val NOTIFICATION_SHOW_TEST_MESSAGE_SNACKBAR = 9998
}
```

2\. 点击 TODO 工具窗口中的 TODO 9，浏览 ``showTestMessageSnackbar`` 实现，了解如何使用 ``sendNotification`` 传入通知常量，携带额外数据并发送通知。

```kotlin
// TODO 9 : Call sendNotification function with NOTIFICATION_SHOW_TEST_MESSAGE_SNACKBAR
private fun showTestMessageSnackbar(message: String) {
    sendNotification(CustomKey.NOTIFICATION_SHOW_TEST_MESSAGE_SNACKBAR, Bundle().apply {
        putString("message", message)
    })
}
```

3\. 点击 TODO 工具窗口中的 TODO 10，浏览 ``customHandleMessage`` 实现，了解如何使用 ``msg.what`` 分辨通知类型，并调用对应方法。携带的额外数据可从 `msg.obj` 获得。由于不存在回送，无需传入 `metadata`。

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
```

4\. 了解以上流程后，删除示例代码。

而对于常见的通信用例，开发工具包已封装成易于调用的方法。其内部实现仍使用 ``REQUEST`` , ``COMMAND`` 和 ``NOTIFICATION``。请参考[常见用例]()。

### 常见用例

#### 接收消息

`接收消息` 以 Parabox 主端为视角，即插件接收来自消息源的消息，并传递至主端的过程。开发工具包提供了 ``receiveMessage`` 方法满足该用例。使用该方法的关键是生成一个 `ReceiveMessageDto` 实例。

|参数|描述|
|---|---|
|contents|MessageContent的列表。详细内容请参阅[消息包]()|
|profile|Profile 的实例。描述当前消息的发送者信息，包括昵称，头像等。id需保证唯一性，用于@时识别发送者。|
|subjectProfile|Profile 的实例。描述当前消息所属会话的信息。对于私聊会话，该值与profile一致。对于群聊，可用于描述群聊信息，包括昵称，头像等。id需保证唯一性，用于唯一识别当前会话|
|timestamp|消息接收时间时间戳|
|messageId|需保证唯一性，用于唯一识别该条消息。允许置空，数据库将为其自动分配id，但置空将导致消息撤回，缓存机制等失效。|
|pluginConnection|用于描述该条消息所属会话的连接消息。 请结合参阅下表|

|参数|描述|
|---|---|
|connectionType|需与 AndroidManifest.xml 中 META_DATA 声明值一致。获取方式可参考示例项目。|
|sendTargetType|描述当前会话类型。可选 `SendTargetType.USER` 或 `SendTargetType.GROUP`|
|id|用于唯一识别当前会话。需要与上表 subjectProfile 中的 id 保持一致|

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

上述代码接收后消息如图

#### 发送消息

开发工具包提供了 ``onSendMessage`` 方法满足该用例。使用该方法的关键是从唯一的参数 `SendMessageDto` 获取所需信息。

|参数|描述|
|----|----|
|contents|MessageContent的列表。详细内容请参阅[消息包]()|
|timestamp|消息发送时间时间戳|
|pluginConnection|用于描述该条消息所属会话的连接消息。 请结合参阅上表|
|messageId|唯一识别该条消息，由系统生成。建议以 map 临时保存，用于撤回该条消息|


该方法是一个挂起函数。确认发送完成后，返回 `true`，反之返回 `false`。

#### 撤回消息

开发工具包提供了 ``onRecallMessage`` 方法满足该用例。仅提供 messageId 一个参数，需配合发送消息时保存的 messageId 使用。

该方法是一个挂起函数。确认撤回成功后，返回 `true`，反之返回 `false`。若不支持撤回，亦可直接返回 `false`。

## 从零开始

想了解工具包的具体使用方法，请参考[开发工具包文档](/parabox-development-kit)。