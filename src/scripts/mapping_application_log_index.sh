curl -X PUT "localhost:9200/applications_log?pretty" -u {elastic-user}:{elastic-password} -H 'Content-Type: application/json' -d'
{
  "mappings": {
    "properties": {
      "@timestamp":{"type": "date"},
      "event_name":{"type":"match_only_text"},
      "type":{"type":"match_only_text"},
      "id":{"type": "match_only_text" },
      "type_event":{"type": "match_only_text"}, 
      "method":{ "type":"match_only_text"},
      "error":{ "type":"flattened", "index":false},
      "content":{ "type":"flattened", "index":false},
    }
  }
}
'