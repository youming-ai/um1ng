---
title: Cloudflare Email Routing 完整设置指南：为你的域名配置专属邮箱
excerpt: 想要用自己的域名收发邮件吗？Cloudflare Email Routing 是一个免费且强大的解决方案。本教程将详细介绍如何设置邮件转发，让你的项目拥有专业的邮件收发能力。
publishDate: 'Nov 30 2024'
isFeatured: true
tags:
  - Tutorial
  - Cloudflare
  - Email
seo:
  image:
    src: '/cloudflare-email.jpg'
    alt: Cloudflare Email Routing 设置指南
---

如果你有自己的域名，想要使用类似 `hello@yourdomain.com` 这样的专属邮箱地址，Cloudflare Email Routing 是一个完美的免费解决方案。它可以将发送到你域名邮箱的邮件转发到你现有的邮箱（如 Gmail、Outlook 等），而且完全免费！

## 什么是 Cloudflare Email Routing？

Cloudflare Email Routing 是 Cloudflare 提供的免费邮件转发服务。它允许你：

- 创建自定义邮箱地址（如 `contact@yourdomain.com`）
- 将邮件转发到你的个人邮箱
- 设置 Catch-all 地址接收所有邮件
- 配置 Email Workers 进行高级处理

## 前提条件

在开始之前，请确保你有：

1. 一个 Cloudflare 账户（免费即可）
2. 一个已添加到 Cloudflare 的域名（DNS 托管在 Cloudflare）
3. 一个用于接收转发邮件的目标邮箱

## 第一步：启用 Email Routing

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 选择你要配置的域名
3. 在左侧菜单中找到 **Email** > **Email Routing**
4. 点击 **Get started** 或 **Enable Email Routing**

## 第二步：添加目标邮箱地址

在设置转发规则之前，你需要先验证目标邮箱：

1. 在 Email Routing 页面，点击 **Destination addresses** 标签
2. 点击 **Add destination address**
3. 输入你想要接收邮件的邮箱地址（如你的 Gmail）
4. 点击 **Add destination address** 确认

Cloudflare 会向该邮箱发送一封验证邮件，点击邮件中的验证链接完成验证。

> **提示：** 验证邮件可能会进入垃圾邮件文件夹，记得检查一下。

## 第三步：创建邮件转发规则

验证目标邮箱后，就可以创建转发规则了：

1. 回到 **Routing rules** 标签
2. 点击 **Create address**
3. 在 **Custom address** 中输入你想要的邮箱前缀（如 `hello`、`contact`、`support` 等）
4. 在 **Destination** 中选择已验证的目标邮箱
5. 点击 **Save** 保存

现在，发送到 `hello@yourdomain.com` 的邮件会自动转发到你的目标邮箱！

### 设置 Catch-all 地址（可选）

如果你想接收发送到域名下所有地址的邮件，可以设置 Catch-all：

1. 在 Routing rules 页面找到 **Catch-all address** 部分
2. 选择 **Send to an email** 并选择目标邮箱
3. 点击 **Save**

这样，无论别人发邮件到 `anything@yourdomain.com`，你都能收到。

## 第四步：验证 DNS 记录

Cloudflare 会自动为你添加必要的 DNS 记录，但你可以检查确认：

1. 进入域名的 **DNS** 设置
2. 确保有以下 MX 记录：

```
Type: MX
Name: @
Mail server: route1.mx.cloudflare.net
Priority: 69

Type: MX  
Name: @
Mail server: route2.mx.cloudflare.net
Priority: 32

Type: MX
Name: @
Mail server: route3.mx.cloudflare.net
Priority: 24
```

3. 同时确保有 SPF 和 DKIM 记录用于邮件认证

## 高级功能：Email Workers

Cloudflare Email Workers 允许你使用代码处理收到的邮件，实现更复杂的功能：

### 创建 Email Worker

1. 在 Email Routing 页面，点击 **Email Workers** 标签
2. 点击 **Create** 创建新的 Worker
3. 编写你的邮件处理逻辑

### 示例：自动回复 + 转发

```javascript
export default {
  async email(message, env, ctx) {
    // 获取发件人信息
    const from = message.from;
    const subject = message.headers.get("subject") || "No Subject";
    
    // 转发邮件到你的邮箱
    await message.forward("your-email@gmail.com");
    
    // 记录日志（可以配合其他服务使用）
    console.log(`Received email from ${from}: ${subject}`);
  }
}
```

### 示例：根据收件地址分类转发

```javascript
export default {
  async email(message, env, ctx) {
    const to = message.to;
    
    // 根据不同的收件地址转发到不同邮箱
    if (to.includes("support@")) {
      await message.forward("support-team@gmail.com");
    } else if (to.includes("sales@")) {
      await message.forward("sales-team@gmail.com");
    } else {
      // 默认转发
      await message.forward("default@gmail.com");
    }
  }
}
```

### 示例：配合 Webhook 使用

```javascript
export default {
  async email(message, env, ctx) {
    const from = message.from;
    const subject = message.headers.get("subject") || "No Subject";
    
    // 转发邮件
    await message.forward("your-email@gmail.com");
    
    // 同时发送 Webhook 通知
    await fetch("https://your-webhook-url.com/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: from,
        subject: subject,
        to: message.to,
        timestamp: new Date().toISOString(),
      }),
    });
  }
}
```

## 在项目中集成邮件功能

### 场景 1：网站联系表单

你可以在网站上创建联系表单，用户提交后发送邮件到你的域名邮箱：

```javascript
// 使用第三方邮件服务发送邮件
// 收件地址设为 contact@yourdomain.com
// Cloudflare 会自动转发到你的个人邮箱
```

### 场景 2：配合 Resend 发送邮件

如果你还需要**发送**邮件的功能，可以配合 [Resend](https://resend.com) 使用：

1. 注册 Resend 账户
2. 验证你的域名（添加 Resend 提供的 DNS 记录）
3. 使用 Resend API 发送邮件

```javascript
// 安装 Resend SDK
// npm install resend

import { Resend } from 'resend';

const resend = new Resend('your-api-key');

await resend.emails.send({
  from: 'hello@yourdomain.com',
  to: 'recipient@example.com',
  subject: 'Hello from my domain!',
  html: '<p>This is a test email.</p>'
});
```

### 场景 3：邮件通知系统

结合 Email Workers 和你的应用：

```javascript
// Email Worker 接收邮件后触发 Webhook
// 你的应用接收 Webhook 并处理通知逻辑
// 可以集成到 Discord、Slack、Telegram 等
```

## 常见问题

### Q: Email Routing 是免费的吗？
A: 是的，完全免费，包括 Email Workers。

### Q: 可以发送邮件吗？
A: Cloudflare Email Routing 只支持**接收和转发**邮件。如果需要发送邮件，建议使用 Resend、SendGrid 等服务。

### Q: 转发有延迟吗？
A: 通常是即时转发，延迟非常小（几秒到几分钟）。

### Q: 可以设置多少个邮箱地址？
A: 免费版没有严格限制，足够个人和小型项目使用。

### Q: 邮件会被标记为垃圾邮件吗？
A: Cloudflare 会自动添加正确的 SPF 和 DKIM 记录，降低被标记为垃圾邮件的可能性。

## 最佳实践

1. **设置 Catch-all**：防止错过任何重要邮件
2. **使用有意义的地址**：如 `hello@`、`contact@`、`support@`
3. **配置 Email Workers**：实现自动化处理
4. **定期检查垃圾邮件**：确保没有误判
5. **备份重要邮件**：转发到多个邮箱以防丢失

## 总结

Cloudflare Email Routing 是一个强大且免费的邮件转发服务，非常适合：

- 个人网站和博客
- 小型项目和创业公司
- 开发者和自由职业者
- 需要专业邮箱形象的任何人

通过本教程，你应该已经可以：
- ✅ 设置基本的邮件转发
- ✅ 配置 Catch-all 地址
- ✅ 使用 Email Workers 进行高级处理
- ✅ 在项目中集成邮件功能

现在就去 Cloudflare 设置你的专属邮箱吧！有任何问题欢迎留言讨论。

---

**相关资源：**
- [Cloudflare Email Routing 官方文档](https://developers.cloudflare.com/email-routing/)
- [Email Workers 文档](https://developers.cloudflare.com/email-routing/email-workers/)
- [Resend - 现代邮件 API](https://resend.com)
