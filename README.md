{
    "manifest_version": 3,
    "name": "CWV Performance Measure",
    "description": ".",
    "version": "1.0",
    "permissions": ["activeTab"],
    "content_scripts": [
      {
        "matches": ["<all_urls>"],
        "js": ["scripts/content.js"],
        "all_frames": true,
        "run_at": "document_end"
      }
    ]
  }
