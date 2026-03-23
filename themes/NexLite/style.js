const Style = () => {
  return (
    <style jsx global>{`
      .dark body {
        background-color: #18181b;
      }

      body {
        background-color: #fafafa;
      }

      html {
        color-scheme: light;
      }

      .dark html {
        color-scheme: dark;
      }

      *,
      *::before,
      *::after {
        transition: background-color 0.3s ease, border-color 0.3s ease, color 0.15s ease, box-shadow 0.3s ease !important;
      }

      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          transition: none !important;
        }
      }

      #notion-article {
        padding-top: 0 !important;
      }

      #notion-article .notion-page-block {
        padding-top: 0 !important;
      }

      html::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      html::-webkit-scrollbar-track {
        background-color: #fafafa;
      }

      .dark html::-webkit-scrollbar-track {
        background-color: #18181b;
      }

      html::-webkit-scrollbar-thumb {
        background: #d4d4d8;
        border-radius: 3px;
      }

      html::-webkit-scrollbar-thumb:hover {
        background: #a1a1aa;
      }

      .line-clamp-1 {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .overflow-x-auto::-webkit-scrollbar {
        height: 4px;
      }

      .overflow-x-auto::-webkit-scrollbar-track {
        background: transparent;
      }

      .overflow-x-auto::-webkit-scrollbar-thumb {
        background: #e4e4e7;
        border-radius: 2px;
      }

      .dark .overflow-x-auto::-webkit-scrollbar-thumb {
        background: #3f3f46;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out forwards;
      }

      @keyframes slideUp {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }

      .animate-slide-up {
        animation: slideUp 0.3s ease-out forwards;
      }

      @keyframes themeSwitch {
        0% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.8;
          transform: scale(0.98);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }

      .theme-switching {
        animation: themeSwitch 0.3s ease-in-out;
      }

      .pix-card {
        background: #ffffff;
        border-radius: 0;
        border-bottom: 1px solid #f4f4f5;
      }

      .dark .pix-card {
        background: #1f1f23;
        border-bottom: 1px solid #2a2a2e;
      }

      .pix-card:hover {
        background: #fefefe;
      }

      .dark .pix-card:hover {
        background: #232327;
      }

      .pix-tag {
        display: inline-flex;
        align-items: center;
        padding: 4px 12px;
        border-radius: 4px;
        font-size: 13px;
        cursor: pointer;
        background: #f4f4f5;
        color: #71717a;
      }

      .dark .pix-tag {
        background: #27272a;
        color: #a1a1aa;
      }

      .pix-tag:hover,
      .pix-tag.active {
        background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        color: #fff;
      }

      .pix-gradient-text {
        background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .pix-gradient-bg {
        background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
      }

      .pix-text-primary {
        color: #18181b;
      }

      .dark .pix-text-primary {
        color: #fafafa;
      }

      .pix-text-secondary {
        color: #71717a;
      }

      .dark .pix-text-secondary {
        color: #a1a1aa;
      }

      .pix-bg-secondary {
        background-color: #f4f4f5;
      }

      .dark .pix-bg-secondary {
        background-color: #27272a;
      }

      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }

      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}</style>
  )
}

export { Style }
