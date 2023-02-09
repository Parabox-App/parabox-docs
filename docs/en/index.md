# Welcome
![Poster](/images/poster.png)

[![Release](https://img.shields.io/github/v/release/Parabox-App/Parabox)](https://github.com/Parabox-App/Parabox/releases)
![stars](https://img.shields.io/github/stars/Parabox-App/Parabox)
[![Telegram](https://img.shields.io/badge/Join-Telegram-red)](https://t.me/parabox_support)
![license](https://img.shields.io/github/license/Parabox-App/Parabox)

An instant messaging client with friendly interface, complete functions, and extensibility.


## Feature

### Flexible
It fits your usage needs, breaks the barrier of information sources, and conducts secondary screening, classification, and grouping of conversations and content at will. Let chat return to pure.
### Personality
The interface design follows Google's new design language - Material You. The theme is generated according to the wallpaper color (Android 12 only), with a variety of built-in color themes to choose from, just designed for you.

Layout adaptation for multiple screen sizes (mobile phones, foldable devices, tablets) and support for dark mode.

![Light](/images/light.png)

![Dark](/images/dark.png)

### Synchronize
Use Firebase Cloud Messaging to build a message synchronization network between different devices. Easily transfer the cost of message reception and greatly save background overhead.
### Plugin
Third-party plugins provide stable news sources. Users can build their own message source according to their usage habits. Messages from different sources can still be processed uniformly and efficiently.
### Follow best practices
Use MAD skills. The interface is built entirely using Jetpack Compose, the new toolkit for native Android interfaces. Jetpack libraries (including but not limited to `Paging 3` , `DataStore` , `Navigation` , `WorkManager` , `Room`) are used in persistence, navigation, background scheduling, architecture and more.

## Function

### Messaging
Supports the receiving and sending of common message types.

The message types and behaviors supported by the client include:

|Message Type|Receive|Send|
|-|-|-|
|Text|✓|✓|
|Image (jpg, png, gif) |✓|✓|
|Voice|✓|✓|
|File|✓|✓|
|Quote Reply|✓|✓|
|@Someone|✓|✓|

>For **expressions**, it is recommended to convert to emoji or text description, receive/send as text
>
>More types and behaviors will be supported through version updates

### Conversation marshalling
Parabox brings you a whole new way of conversationz management! Say goodbye to cluttered multi-platform conversationzs and duplicate notifications, the new grouping feature allows users to group **different conversationzs** from **different platforms** into a new conversationz without any additional overhead. The grouped conversationz enjoys the same functional experience as a normal conversationz.

This is an exciting feature: you can get rid of numerous workgroups with similar functions—you only need to keep one.

### File management
Have you ever faced the dilemma of having difficulty downloading historical files? Documents scattered everywhere are not only of various types, but also difficult to trace and locate.

Parabox has carefully prepared an independent file management page for you. Provides **time**, **type**, **file size** and other filter conditions. With keyword search, it can help you quickly locate files and expand the workflow.

### Cloud Backup

Parabox provides easy access to your favorite cloud storage services. Automatically back up files to the cloud when idle in the background and network conditions allow, without occupying local storage space. From now on the session file is **no more missed, no more lost**.

### Notification evolution

The notification evolution function benefits from Android's constantly improving notification standards, making the notification function more standardized and more practical. The adapted system features include:

- Notification channels
- Expandable notification
- Quick Reply
- Bubbles

### System level push*
Through FCM messages, Parabox can **stop background service residency** while receiving messages normally. The system-level push service accepts the unified scheduling of the system, and has a better scheduling mechanism and better performance. This will greatly save system resources and extend the battery life of the device.

> *This feature is not yet stable. Limited by the message sources, the cost of message reception is not fundamentally reduced, but only passed on.

### Plug-in
Third-party plugins provide richer and more stable message sources. Users can build their own message source according to their habits, messages from different sources can be processed uniformly and efficiently.

For plug-in development, it also provides [Development Toolkit](https://github.com/Parabox-App/parabox-development-kit) and documents, including predefined classes and tool methods, helping developers ignore connection details and focus on function development. You can jump to read [Development Documentation](/en/developer).

### Data export
Parabox provides a data export function that allows users to export conversation data to local storage for use on other devices or for backup purposes. At the same time, users can export conversation data to other locations, such as cloud storage.


## Installation

Please refer to [Quick Start](/en/quick-start).

## Development

The plugin ecosystem of Parabox needs to be maintained by the open source community. We look forward to your joining.

To get started with plugin development quickly, jump to [Developer Documentation](/en/developer).

## Support this project

If you endorse Parabox, please go to [Github](https://github.com/Parabox-App/Parabox) to give Parabox a **star**, or go to [Google Play](https://play.google.com/store/apps /details?id=com.ojhdtapp.parabox) to leave a review for Parabox. This will bring us great support!
