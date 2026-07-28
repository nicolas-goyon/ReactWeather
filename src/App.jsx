import SearchBar from './components/SearchBar';

export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-slate-100">
      <h1 className="text-4xl font-bold tracking-tight">ReactWeather</h1>
      <p className="mt-4 text-slate-400">
        React + Vite + Tailwind CSS boilerplate. Edit{' '}
        <code className="rounded bg-slate-800 px-1.5 py-0.5 text-sm text-sky-400">
          src/App.jsx
        </code>{' '}
        to get started.
      </p>

    </main>
  )
}
