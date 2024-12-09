import { useGradient } from './hooks/useGradient';
import { GradientControls } from './components/GradientControls';
import { GradientPreview } from './components/GradientPreview';
import { Moon, Sun } from 'lucide-react';
import { GithubIcon } from './components/icons/GitHubIcon';
import { useState, useEffect } from 'react';
import { toggleTheme } from './store/themeConfigSlice';
import { IRootState } from './store';
import { useDispatch, useSelector } from 'react-redux';
function App() {
  const [isScrolled, setIsScrolled] = useState(false);

  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state: IRootState) => state.themeConfig);

  const {
    gradient,
    updateType,
    updateAngle,
    updateCenter,
    addColorStop,
    updateColorStop,
    removeColorStop,
    generateCSS,
  } = useGradient();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    dispatch(toggleTheme(isDarkMode ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Enhanced Header */}
      <header
        className={`
          fixed w-full top-0 z-50 transition-all duration-300
          ${isScrolled
            ? 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-md'
            : 'bg-transparent'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo Icon */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg opacity-0 group-hover:opacity-50 blur transition duration-300" />
                <div className="relative p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg transform group-hover:scale-110 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg"  className="text-white" width="1.5em" height="1.5em" viewBox="0 0 32 32"><circle cx="10" cy="12" r="2" fill="currentColor"/><circle cx="16" cy="9" r="2" fill="currentColor"/><circle cx="22" cy="12" r="2" fill="currentColor"/><circle cx="23" cy="18" r="2" fill="currentColor"/><circle cx="19" cy="23" r="2" fill="currentColor"/><path fill="currentColor" d="M16.54 2A14 14 0 0 0 2 16a4.82 4.82 0 0 0 6.09 4.65l1.12-.31a3 3 0 0 1 3.79 2.9V27a3 3 0 0 0 3 3a14 14 0 0 0 14-14.54A14.05 14.05 0 0 0 16.54 2m8.11 22.31A11.93 11.93 0 0 1 16 28a1 1 0 0 1-1-1v-3.76a5 5 0 0 0-5-5a5 5 0 0 0-1.33.18l-1.12.31A2.82 2.82 0 0 1 4 16A12 12 0 0 1 16.47 4A12.18 12.18 0 0 1 28 15.53a11.9 11.9 0 0 1-3.35 8.79Z"/></svg>
                </div>
              </div>

              {/* Brand Name and Tagline */}
              <div className="flex flex-col">
                <h1 className="text-2xl font-semibold font-yatra bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Spektra
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 bg-slate-200/70 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-300"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <a
                href="https://github.com/elmorjanimohamed9"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-200/70 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-300"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-28 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Section */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-slate-200/35">
              <div className="mb-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                  Gradient Controls
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Customize your gradient settings
                </p>
              </div>
              <GradientControls
                gradient={gradient}
                onUpdateType={updateType}
                onUpdateAngle={updateAngle}
                onUpdateCenter={updateCenter}
                onAddColor={addColorStop}
                onUpdateColor={(id, color) => updateColorStop(id, { color })}
                onUpdatePosition={(id, position) => updateColorStop(id, { position })}
                onRemoveColor={removeColorStop}
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-7">
            <div className="space-y-6">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-slate-200/35">
                <div className="mb-6">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                    Preview
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    See your gradient in action
                  </p>
                </div>
                <GradientPreview gradient={gradient} css={generateCSS()} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="mt-auto py-8 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Created by{' '}
            <span className="text-red-500 animate-pulse">❤️</span>{' '}
            <a
              href="https://github.com/elmorjanimohamed9"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-500 transition-colors duration-300"
            >
              Mohamed El MORJANI
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;