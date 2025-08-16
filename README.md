# MapFlow - Modern Process Diagram Viewer

A beautiful, interactive React application for visualizing process flows and diagrams with modern UI/UX design.

## ✨ Features

### 🎯 Interactive Force Graph
- **D3.js powered** force-directed network visualization
- **Node highlighting** - hover to see connected processes/flows
- **Drag & drop** nodes for custom positioning
- **Zoom & pan** for detailed exploration
- **Color-coded processes** - unique colors for each process
- **Real-time interactions** without conflicts

### 🏊‍♂️ Modern Swimlane View
- **Collapsible sections** - expand/collapse individual processes
- **Bulk controls** - expand all or collapse all with one click
- **Beautiful gradient headers** for each process
- **Flow cards** with rounded corners and hover effects
- **Responsive grid layout** adapting to screen size
- **Enhanced metadata** display with badges and icons

### 🎨 Modern Design System
- **Atomic Design Pattern** - scalable component architecture
- **Glassmorphism effects** with backdrop blur
- **Smooth animations** and micro-interactions
- **Tailwind CSS** for consistent styling
- **No sharp edges** - everything uses rounded corners
- **Professional color palette** with gradient accents

### 📱 User Experience
- **Responsive design** for all screen sizes
- **Intuitive navigation** between views
- **Search and filter** capabilities
- **Hover tooltips** with additional information
- **Keyboard accessible** interactions
- **Fast performance** with optimized rendering

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ArmannGokdemir/MapFlow.git
   cd MapFlow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **D3.js v7** - Data visualization and force simulation
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript ES6+** - Modern JavaScript features

## 📁 Project Structure

```
src/
├── components/
│   ├── atoms/          # Basic UI components
│   ├── molecules/      # Composed components
│   └── organisms/      # Complex components
├── utils/              # Helper functions
└── assets/             # Static assets
```

### Component Architecture

- **Atoms**: Button, Card, Badge, Input, Checkbox
- **Molecules**: ViewToggle, ProcessFilter, HoverTooltip
- **Organisms**: ForceGraph, Swimlane, Header, Sidebar

## 🎯 Usage Examples

### Force Graph View
- Switch to "Force Graph" in the view toggle
- Hover over nodes to highlight connections
- Drag nodes to rearrange the layout
- Click nodes for detailed information
- Use mouse wheel to zoom in/out

### Swimlane View
- Switch to "Swimlane" in the view toggle
- Use "Expand All" / "Collapse All" buttons in header
- Click individual process headers to toggle sections
- Browse flow cards within each process
- Click flow cards for detailed views

## 🔧 Configuration

The application uses sample data defined in `src/utils/dataUtils.js`. You can modify this file to use your own process and flow data.

### Data Format
```javascript
{
  nodes: [
    { id: "1", name: "Process Name", type: "process" },
    { id: "2", name: "Flow Name", type: "flow" }
  ],
  links: [
    { source: "1", target: "2" }
  ]
}
```

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update color palettes in component files
- Adjust animations and transitions in CSS classes

### Components
- Add new atomic components in `src/components/atoms/`
- Create custom organisms for new visualization types
- Extend molecules for additional UI patterns

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a private repository. Please contact the maintainer for contribution guidelines.

---

**Built with ❤️ by [ArmannGokdemir](https://github.com/ArmannGokdemir)**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Diagram Viewer

Vite + React (JavaScript) app, configured with Tailwind CSS.

## Run

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

## Tailwind CSS

- Config: `tailwind.config.js`
- PostCSS: `postcss.config.js` (uses `@tailwindcss/postcss`)
- Directives in `src/index.css`
