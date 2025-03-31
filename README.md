```json
{
  "manifest_version": 3,
  "name": "CWV Performance Measure",
  "description": ".",
  "version": "1.0",
  "permissions": ["activeTab", "scripting", "storage", "tabs"],
  "content_scripts": [
    {
      "matches": ["http://localhost:3000/*", "http://localhost:5001/"],
      "js": ["scripts/measure.js"],
      "css": ["styles/style.css"],
      "all_frames": true,
      "run_at": "document_start"
    }
  ],
  "action": {
    "default_popup": "popup/popup.html"
  }
}
  ```


## [PerformanceObserver](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)

```javascript
function perfObserver(list, observer) {
  list.getEntries().forEach((entry) => {
    if (entry.entryType === "mark") {
      console.log(`${entry.name}'s startTime: ${entry.startTime}`);
    }
    if (entry.entryType === "measure") {
      console.log(`${entry.name}'s duration: ${entry.duration}`);
    }
  });
}
const observer = new PerformanceObserver(perfObserver);
observer.observe({ entryTypes: ["measure", "mark"] });
```

[CLS](https://developer.mozilla.org/en-US/docs/Web/API/LayoutShift)


https://w3c.github.io/event-timing/


The Performance Measure Chrome extension leverages the Performance API to visually analyze specific sections of a webpage by marking key performance metrics on the browser's performance timeline. This tool allows developers and performance analysts to track and measure the efficiency of web applications, ensuring optimal performance.

Key Features:
Custom Performance Measurement: The extension enables users to define custom performance measures, utilizing the PerformanceMark and PerformanceMeasure interfaces. These marks and measures are added to the browser’s performance timeline, allowing developers to track specific events and sections of a page that might be critical for performance.

Browser’s Performance Timeline: The extension records high-precision timestamps of performance events, which are displayed within the browser's developer tools. This timeline helps visualize performance issues and bottlenecks in real-time.

Metrics Tracking: Performance entries, such as PerformanceEventTiming and custom events, are recorded automatically or can be defined by the user. These metrics include information like name, duration, start time, and type of event, providing detailed insights into how various page sections are performing.

PerformanceObserver Integration: The extension utilizes the PerformanceObserver interface, which listens for performance entries as they are logged. This allows the extension to dynamically track and display performance data as it is generated, ensuring that users are always up-to-date on performance insights.

Data Analytics: Beyond immediate visual tracking, the extension can send performance data to analytics endpoints, helping teams track performance trends over time and improve web application efficiency.

Cross-Scope Support: The extension works in both the Window and Worker global scopes, offering flexibility to track performance across different contexts within the application.

In summary, the Performance Measure Chrome extension helps developers gain deeper insights into web performance by marking and visualizing specific metrics directly on the browser’s performance timeline. This allows for more targeted performance optimization and monitoring.

https://developer.mozilla.org/en-US/docs/Web/API/Performance_API


https://developer.mozilla.org/en-US/docs/Web/API/PerformanceElementTiming