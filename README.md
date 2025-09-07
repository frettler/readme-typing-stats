# 🎬 GitHub README Dynamic Typing

Generate animated SVGs with typewriter effect using live GitHub data! Perfect for making your GitHub profile README more engaging and dynamic.z

![Demo](https://via.placeholder.com/600x100/0d1117/58a6ff?text=✨+Animated+GitHub+Stats+with+Typing+Effect+✨)

## 🚀 Features

- **🎨 Web Interface**: Interactive form with live preview and code generation
- **Live GitHub Data**: Display real-time stats from commits, stars, followers, forks, and repositories
- **Typewriter Animation**: Beautiful typing effect with customizable speed and cursor
- **Multiple Themes**: Dark, light, ocean, forest, and sunset themes
- **Highly Customizable**: Colors, fonts, sizes, animation speed, and more
- **Caching System**: Efficient caching to respect GitHub API rate limits
- **GitHub Action Integration**: Scale to unlimited users with pre-generated data

## 📖 Quick Start

### 🎨 Web Interface (Easiest Way)

Visit the **web interface** at your deployed service URL to generate custom SVG links with live preview:

- Interactive form with all customization options
- Live preview of your animated SVG
- Copy-paste ready HTML, Markdown, and URL code
- No technical knowledge required!

Note on link domain:

- The generated links use the current page's domain. When you open the generator at `https://yourapp.vercel.app`, the copied Markdown/URL will point to that domain. If you test locally, replace `http://localhost:3000` with your deployed domain before using in a README.

### For End Users (Adding to Your README)

**No setup required!** Just add an image tag to your README:

```html
<img src="https://your-service.com/typing?user=YOUR_USERNAME&type=commit" />
```

Replace `YOUR_USERNAME` with your GitHub username. That's it! ✨

### For Service Operators (Deploying Your Own Instance)

If you want to run your own instance of this service, see the [Installation & Deployment](#️-installation--deployment) section below.

### Examples

**Latest Commit:**

```html
<img src="https://your-service.com/typing?user=octocat&type=commit" />
```

**Star Count with Custom Theme:**

```html
<img
  src="https://your-service.com/typing?user=octocat&type=stars&theme=ocean&color=%2338bdf8"
/>
```

<!-- Multi-line feature has been removed -->

**Custom Styling:**

```html
<img
  src="https://your-service.com/typing?user=octocat&type=followers&color=%23ff6b6b&size=16&speed=30&cursor=true"
/>
```

## 🎨 Customization Options

| Parameter | Description                | Default     | Options                                          |
| --------- | -------------------------- | ----------- | ------------------------------------------------ |
| `user`    | GitHub username (required) | -           | Any valid GitHub username                        |
| `type`    | Data type to display       | `commit`    | `commit`, `stars`, `followers`, `forks`, `repos` |
| `color`   | Text color                 | Theme-based | Any hex color (URL encoded)                      |
| `size`    | Font size in pixels        | `14`        | Any positive integer                             |
| `cursor`  | Show blinking cursor       | `true`      | `true`, `false`                                  |
| `repeat`  | Loop animation             | `true`      | `true`, `false`                                  |
| `speed`   | Typing speed (ms per char) | `50`        | Any positive integer                             |
| `theme`   | Color theme                | `dark`      | `dark`, `light`, `ocean`, `forest`, `sunset`     |
| `width`   | SVG width                  | `400`       | Any positive integer                             |
| `height`  | SVG height                 | `50`        | Any positive integer                             |

### 🎭 Available Themes

| Theme    | Description        | Text Color | Background |
| -------- | ------------------ | ---------- | ---------- |
| `dark`   | GitHub dark theme  | `#e6edf3`  | `#0d1117`  |
| `light`  | GitHub light theme | `#24292f`  | `#ffffff`  |
| `ocean`  | Ocean blue theme   | `#7dd3fc`  | `#0f172a`  |
| `forest` | Forest green theme | `#86efac`  | `#14532d`  |
| `sunset` | Warm sunset theme  | `#fbbf24`  | `#7c2d12`  |

### 📊 Data Types

| Type        | Description                  | Example Output                       |
| ----------- | ---------------------------- | ------------------------------------ |
| `commit`    | Latest commit message        | "Latest commit: Fix bug in index.js" |
| `stars`     | Total stars across all repos | "Total Stars: 1,234"                 |
| `followers` | Follower count               | "Followers: 567"                     |
| `forks`     | Total forks across all repos | "Total Forks: 89"                    |
| `repos`     | Public repository count      | "Public Repos: 42"                   |

## 🛠️ Installation & Deployment

### Local Development

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/github-readme-dynamic-typing.git
   cd github-readme-dynamic-typing
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp env.example .env
   # Edit .env and add your GitHub token (optional but recommended)
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Test the service:**
   ```
   http://localhost:3000/typing?user=octocat&type=commit
   ```

### Production Deployment

#### Deploy to Vercel

1. **Fork this repository**

2. **Connect to Vercel:**

   - Go to [Vercel](https://vercel.com)
   - Import your forked repository
   - Add environment variable `GITHUB_TOKEN` (optional)

3. **Deploy and use your URL:**
   ```html
   <img
     src="https://your-app.vercel.app/typing?user=YOUR_USERNAME&type=commit"
   />
   ```

#### Deploy to Railway

1. **Fork this repository**

2. **Connect to Railway:**

   - Go to [Railway](https://railway.app)
   - Create new project from GitHub
   - Add environment variable `GITHUB_TOKEN` (optional)

3. **Use your Railway URL**

#### Deploy to Render

1. **Fork this repository**

2. **Connect to Render:**
   - Go to [Render](https://render.com)
   - Create new Web Service
   - Connect your repository
   - Add environment variable `GITHUB_TOKEN` (optional)

### Environment Variables

```bash
# Optional: GitHub Classic Personal Access Token for SERVICE OWNER only
# This increases rate limits from 60/hour to 5,000/hour
# Generate at: https://github.com/settings/tokens (use Classic token, no scopes needed)
GITHUB_TOKEN=your_github_token_here

# Server port (default: 3000)
PORT=3000

# Cache TTL in seconds (default: 600)
CACHE_TTL=600
```

**Important**: The GitHub token is only needed by whoever deploys/runs the service, not by end users!

### Repository Hygiene

- Ignore runtime cache on commit:

```gitignore
cache/
cache/*.json
```

- Optional: exclude docs/examples from deployments without deleting them by adding a `.vercelignore` file:

```gitignore
examples/
```

### Vercel Notes

- Vercel’s runtime filesystem is read-only; disk-based cache is not persisted across requests. The service uses in-memory caching at runtime.
- Always copy links from your deployed domain so they work in READMEs.

## ⚡ GitHub Action Integration (Unlimited Scale)

For unlimited scaling without API rate limits, users can set up a GitHub Action to pre-generate their data:

### Setup Instructions for Users

1. **Create the workflow file** in your repository:

   ```bash
   mkdir -p .github/workflows
   ```

2. **Copy the action template** from `action-template/fetch-data.yml` to `.github/workflows/fetch-data.yml`

3. **Commit and push** - the action will run automatically

4. **Use the JSON endpoint:**
   ```html
   <img
     src="https://your-service.com/typing?user=YOUR_USERNAME&type=commit&source=json"
   />
   ```

The action will:

- Run every hour automatically
- Fetch your latest GitHub stats
- Store them in `.github/data/github-stats.json`
- Your service reads this JSON instead of calling GitHub API

## 📚 API Endpoints

### `GET /typing`

Main endpoint for generating animated SVGs.

**Query Parameters:** See customization options above.

**Response:** SVG image with typing animation.

### `GET /typing/preview`

Preview endpoint for testing custom text.

**Query Parameters:**

- `text` - Custom text to animate
- All styling parameters from main endpoint

### `GET /typing/info`

Returns API documentation and available options.

## 🏗️ Project Structure

```
github-readme-dynamic-typing/
├── server/
│   ├── index.js              # Express server setup
│   ├── routes/
│   │   └── typing.js         # Main API routes
│   ├── services/
│   │   └── githubService.js  # GitHub API integration
│   ├── svg/
│   │   └── svgGenerator.js   # SVG animation generator
│   └── utils/
│       └── helpers.js        # Utility functions
├── public/                   # Web interface
│   ├── index.html            # Main webpage
│   ├── styles.css            # Styling
│   └── script.js             # JavaScript functionality
├── cache/                    # Cache storage directory
├── action-template/
│   └── fetch-data.yml        # GitHub Action template
├── examples/
│   └── usage-examples.md     # Usage examples
├── scripts/
│   └── setup.js              # Setup script
├── test/
│   └── basic-test.js         # Basic tests
├── package.json
├── env.example
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- Inspired by [readme-typing-svg](https://github.com/DenverCoder1/readme-typing-svg)
- Built with GitHub's REST API
- Animated with SVG and CSS animations

## ❓ Frequently Asked Questions

### Do I need a GitHub token to use this in my README?

**No!** End users don't need any tokens. Just use the service URL with your username.

### Do I need to install anything?

**No!** This works like any other web service - just use the `<img>` tag in your README.

### Who needs the GitHub token?

Only the person **running/deploying** the service needs a token (for higher rate limits). If you're just using someone else's deployed service, you don't need anything.

### How do I get my own GitHub token (if deploying the service)?

1. Go to [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. Click "Generate new token" → **"Generate new token (classic)"**
3. **Leave all scopes unchecked** (we only read public data)
4. Set expiration as preferred (or no expiration)
5. Generate and copy the token
6. Add it as `GITHUB_TOKEN` environment variable when deploying

**Note**: Use Classic tokens, not Fine-grained tokens, for simplicity.

### Is this secure?

Yes! The service only reads **public** GitHub data that's already visible to everyone.

## 📞 Support

- 🐛 [Report bugs](https://github.com/your-username/github-readme-dynamic-typing/issues)
- 💡 [Request features](https://github.com/your-username/github-readme-dynamic-typing/issues)
- 📖 [Documentation](https://github.com/your-username/github-readme-dynamic-typing/wiki)

---

**Made with ❤️ for the GitHub community**

[![GitHub stars](https://img.shields.io/github/stars/your-username/github-readme-dynamic-typing?style=social)](https://github.com/your-username/github-readme-dynamic-typing)
[![GitHub forks](https://img.shields.io/github/forks/your-username/github-readme-dynamic-typing?style=social)](https://github.com/your-username/github-readme-dynamic-typing)
