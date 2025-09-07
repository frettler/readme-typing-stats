# 🎨 Usage Examples

This file contains various examples of how to use the GitHub README Dynamic Typing service in your projects.

## 📋 Table of Contents

1. [Basic Examples](#basic-examples)
2. [Themed Examples](#themed-examples)
3. [Multi-line Examples](#multi-line-examples)
4. [Custom Styling](#custom-styling)
5. [GitHub Profile README](#github-profile-readme)
6. [Repository README](#repository-readme)

## Basic Examples

### Latest Commit Message

```html
<img
  src="https://your-service.com/typing?user=octocat&type=commit"
  alt="Latest Commit"
/>
```

### Star Count

```html
<img
  src="https://your-service.com/typing?user=octocat&type=stars"
  alt="GitHub Stars"
/>
```

### Follower Count

```html
<img
  src="https://your-service.com/typing?user=octocat&type=followers"
  alt="GitHub Followers"
/>
```

### Fork Count

```html
<img
  src="https://your-service.com/typing?user=octocat&type=forks"
  alt="GitHub Forks"
/>
```

### Repository Count

```html
<img
  src="https://your-service.com/typing?user=octocat&type=repos"
  alt="Public Repositories"
/>
```

## Themed Examples

### Dark Theme (Default)

```html
<img
  src="https://your-service.com/typing?user=octocat&type=commit&theme=dark"
  alt="Dark Theme"
/>
```

### Light Theme

```html
<img
  src="https://your-service.com/typing?user=octocat&type=stars&theme=light"
  alt="Light Theme"
/>
```

### Ocean Theme

```html
<img
  src="https://your-service.com/typing?user=octocat&type=followers&theme=ocean"
  alt="Ocean Theme"
/>
```

### Forest Theme

```html
<img
  src="https://your-service.com/typing?user=octocat&type=forks&theme=forest"
  alt="Forest Theme"
/>
```

### Sunset Theme

```html
<img
  src="https://your-service.com/typing?user=octocat&type=repos&theme=sunset"
  alt="Sunset Theme"
/>
```

<!-- Multi-line feature has been removed. Use single type per image. -->

## Custom Styling

### Large Text with Custom Color

```html
<img
  src="https://your-service.com/typing?user=octocat&type=commit&size=18&color=%23ff6b6b"
  alt="Large Red Text"
/>
```

### Fast Typing Speed

```html
<img
  src="https://your-service.com/typing?user=octocat&type=stars&speed=20"
  alt="Fast Typing"
/>
```

### Slow Typing Speed

```html
<img
  src="https://your-service.com/typing?user=octocat&type=followers&speed=100"
  alt="Slow Typing"
/>
```

### No Cursor

```html
<img
  src="https://your-service.com/typing?user=octocat&type=forks&cursor=false"
  alt="No Cursor"
/>
```

### No Repeat (One-time Animation)

```html
<img
  src="https://your-service.com/typing?user=octocat&type=repos&repeat=false"
  alt="One-time Animation"
/>
```

### Custom Dimensions

```html
<img
  src="https://your-service.com/typing?user=octocat&type=commit&width=600&height=80"
  alt="Custom Size"
/>
```

## GitHub Profile README

Here's how to integrate multiple animated stats into your GitHub profile README:

```markdown
# Hi there! 👋 I'm [Your Name]

## 📊 My GitHub Stats

<div align="center">

![Latest Commit](https://your-service.com/typing?user=YOUR_USERNAME&type=commit&theme=dark)

![GitHub Stars](https://your-service.com/typing?user=YOUR_USERNAME&type=stars&theme=ocean&color=%2338bdf8)

![Followers](https://your-service.com/typing?user=YOUR_USERNAME&type=followers&theme=forest&color=%234ade80)

![Public Repos](https://your-service.com/typing?user=YOUR_USERNAME&type=repos&theme=sunset&color=%23f59e0b)

</div>

<!-- Multi-line feature removed -->
```

## Repository README

For project repositories, you can show the latest activity:

```markdown
# Project Name

![Latest Activity](https://your-service.com/typing?user=YOUR_USERNAME&type=commit&theme=dark&width=500)

## Stats

<table>
<tr>
<td>

![Stars](https://your-service.com/typing?user=YOUR_USERNAME&type=stars&theme=ocean)

</td>
<td>

![Forks](https://your-service.com/typing?user=YOUR_USERNAME&type=forks&theme=forest)

</td>
</tr>
</table>
```

## Advanced Examples

### Combining with Other Badges

```markdown
![GitHub followers](https://img.shields.io/github/followers/YOUR_USERNAME?style=social)
![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME?style=social)

![Typing Animation](https://your-service.com/typing?user=YOUR_USERNAME&type=commit&theme=dark)
```

### Center Alignment

```html
<div align="center">
  <img
    src="https://your-service.com/typing?user=octocat&type=commit&theme=ocean&size=16"
    alt="Centered Animation"
  />
</div>
```

### With Links

```html
<a href="https://github.com/YOUR_USERNAME">
  <img
    src="https://your-service.com/typing?user=YOUR_USERNAME&type=followers&theme=dark"
    alt="GitHub Profile"
  />
</a>
```

## Preview Testing

Before adding to your README, test your animations using the preview endpoint:

```
https://your-service.com/typing/preview?text=Your%20Custom%20Text&theme=dark&color=%23ff6b6b
```

## Tips for Best Results

1. **Choose appropriate themes** that match your profile/repository style
2. Multi-line feature has been removed
3. **Test different speeds** to find what feels right for your content
4. **Consider your audience** - some users might prefer static content
5. **Use semantic alt text** for accessibility

## URL Encoding Reference

When using special characters in URLs, make sure to encode them:

- `#` → `%23`
- ` ` (space) → `%20`
- `&` → `%26`
- `+` → `%2B`

Example:

```
color=#ff6b6b → color=%23ff6b6b
```

---

**Need more help?** Check out the main [README.md](../README.md) for detailed documentation!
