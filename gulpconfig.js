
/**
 * # Gulp Configuration.
 * ------------------------------------------------------------------
 */
module.exports = {

  banner: [
    '/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @author <%= pkg.author %>',
    ' * @license <%= pkg.license %>',
    '**/',
    '',
  ].join('\n'),

  // Browser Sync
  browsersync: {
    files: ['**/*', '!**.map', '!**.css'], // Exclude map files.
    notify: false, // 
    open: true, // Set it to false if you don't like the broser window opening automatically.
    port: 8080, // 
    proxy: 'localhost/customatic', // 
    watchOptions: {
      debounceDelay: 2000 // This introduces a small delay when watching for file change events to avoid triggering too many reloads
    },
    snippetOptions: {
      whitelist: ['/wp-admin/admin-ajax.php'],
      blacklist: ['/wp-admin/**']
    }
  },

  // Style Related.
  style: {
    build: [ 
      {
        src: './assets/sass/style.scss', // Path to main .scss file.
        dest: './', // Path to place the compiled CSS file.
        sourcemaps: true, // Allow to enable/disable sourcemaps or pass object to configure it.
        minify: true, // Allow to enable/disable minify the source.
      },
      {
        src: './assets/sass/editor-style.scss', 
        dest: './assets/css',
        sourcemaps: true,
        minify: true
      }
    ],
    rtl: [ // RTL builds.
      {
        src: './style.css', 
        dest: './', // The source files will be converted and suffixed to `-rtl` in this destination.
      }
    ],

    // Browsers you care about for auto-prefixing.
    autoprefixer: { 
      browsers: [
        "Android 2.3",
        "Android >= 4",
        "Chrome >= 20",
        "Firefox >= 24",
        "Explorer >= 9",
        "iOS >= 6",
        "Opera >= 12",
        "Safari >= 6"
      ]
    },

    // SASS Configuration for all builds.
    sass: { 
      errLogToConsole: true,
      outputStyle: 'compact',
    },

    // CSS MQ Packer configuration for all builds and style tasks.
    cssMqpacker: { 
    },

    // CSS nano configuration for all builds.
    cssnano: { 
    },

    // rtlcss configuration for all builds.
    rtlcss: { 
    }
  },
  
  // Script related.
  script: {
    bundles: [
      {
        src: [
          './assets/js/trending-bar.js',
          './assets/js/sticky-header.js',
          './assets/js/main.js',
        ],
        dest: './assets/js/hypernews.js', // Destination of the bundle.
        sourcemaps: true, // Allow to enable/disable sourcemaps or pass object to configure it.
        babel: true // Allow to enable/disable babel compiler or pass object to configure it.
      }
    ],
    minify: [
      {
        src: [
          './assets/js/hypernews.js',
          './assets/js/weather-card.js'
        ],
        dest: './assets/js/', 
        sourcemaps: true // Allow to enable/disable sourcemaps or pass object to configure it.
      },
      {
        src: [
          './assets/js/lib/modernizr.js',
          './assets/js/lib/jquery.sticky-sidebar.js',
          './assets/js/lib/nanoscroller.js',
          './assets/js/lib/owl.carousel.js',
          './assets/js/lib/resize-sensor.js',
          './assets/js/lib/slick.js',
          './assets/js/lib/typeahead.js'
        ],
        dest: './assets/js/lib',
        sourcemaps: false
      }
    ],
    lint: {
      src: [
        './assets/js/main.js',
        './assets/js/trending-bar.js',
        './assets/js/sticky-header.js',
        './assets/js/weather-card.js'
      ]        
    }
  },

  // Translate related.
  translate: {
    wpPot: {
      src:  ['**/*.php', '*.php', '!node_modules/**'],
      dest: 'languages/hypernews.pot',
      options: {
        domain: 'hypernews',
        package: 'Hypernews'
      }
    },
    checktextdomain: {
      src: ['**/*.php', '*.php', '!node_modules/**'],
      options: {
        text_domain: 'hypernews', //Specify allowed domain(s) 
        keywords: [ // List keyword specifications 
          '__:1,2d',
          '_e:1,2d',
          '_x:1,2c,3d',
          'esc_html__:1,2d',
          'esc_html_e:1,2d',
          'eschtml_x:1,2c,3d',
          'esc_attr__:1,2d', 
          'esc_attr_e:1,2d', 
          'esc_attr_x:1,2c,3d', 
          '_ex:1,2c,3d',
          '_n:1,2,4d', 
          '_nx:1,2,4c,5d',
          '_n_noop:1,2,3d',
          '_nx_noop:1,2,3c,4d'
        ]
      }
    }
  },

  // Images related.
  image: {
    build: [
      {
        src: [
          './assets/images/*',
          '!./assets/images/svg-icons.svg',
          '!./assets/images/weather-icons.svg'
        ],
        dest: './assets/images/',
      }
    ],

    // Configuration of imagemin plugin for all builds.
    imagemin: {
      progressive: true,
      optimizationLevel: 3, // 0-7 low-high
      interlaced: true,
      svgoPlugins: [{removeViewBox: false}]
    }
  },

  // Compress related.
  compress: {
    filename: 'hypernews.zip',
    src: [
      '**/*',
      '!**/*.map',
      '!todo',
      '!.todo',
      '!hypernews.zip',
      '!bs-config.js',
      '!.vscode',
      '!node_modules/**',
      '!.gitignore',
    ],  
    dest: './'
  },

  // Clean specific files.
  clean: [
    '**/.DS_Store',
    './assets/js/**/*.min.js',
    '**/*.map',
    '**/*.min.css',
    'assets/js/hypernews.js'
  ],

  // Watch related.
  watch: {
    css: ['./assets/sass/**/*'],
    js: ['assets/js/**/*.js', '!assets/js/**/*.min.js'],
    images: ['./assets/images/**/*']
  },
};