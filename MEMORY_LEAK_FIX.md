# Memory Leak Fix - WebSocket Session Cleanup

## Problem Description

### Issue
The WebSocket server had a critical memory leak where active interview sessions were not being cleaned up when clients disconnected unexpectedly. This caused server memory usage to grow indefinitely over time, eventually leading to performance degradation or server crashes.

### Root Cause
The `activeSessions`, `questionTimers`, `performanceCache`, and `socketToSession` Maps were populated when interviews started but only cleaned up when interviews completed successfully through the normal flow. If a client:
- Closed their browser abruptly
- Lost network connection
- Experienced a crash or timeout
- Force-quit the application

The associated session data remained in memory indefinitely, never being freed.

### Impact
- **Memory Leak**: Server memory grew continuously with each abandoned session
- **Resource Exhaustion**: Eventually led to OOM (Out of Memory) errors
- **Performance Degradation**: Increased memory pressure affected overall server performance
- **Scalability Issues**: Limited the number of concurrent users the server could support
- **Production Instability**: Required manual server restarts to free memory

## Solution Implemented

### Changes Made

#### 1. Added Socket-to-Session Tracking
```javascript
const socketToSession = new Map(); // socket.id -> sessionId
```
This bidirectional mapping allows instant lookup of which session belongs to a disconnecting socket.

#### 2. Track Socket Association on Session Start
When a candidate starts an interview, we now track the socket-session relationship:
```javascript
socketToSession.set(socket.id, sessionId);
```

#### 3. Enhanced Disconnect Handler
Implemented comprehensive cleanup in the disconnect event:
```javascript
socket.on("disconnect", () => {
  const sessionId = socketToSession.get(socket.id);
  
  if (sessionId) {
    // Clear pending timers
    const timer = questionTimers.get(sessionId);
    if (timer) {
      clearTimeout(timer);
      questionTimers.delete(sessionId);
    }
    
    // Remove all session data
    activeSessions.delete(sessionId);
    performanceCache.delete(sessionId);
    socketToSession.delete(socket.id);
  }
});
```

#### 4. Enhanced Normal Completion Cleanup
Added cleanup of socket-to-session mapping in the `completeInterview` function to prevent stale references.

### Files Modified
- `Backend/sockets/InterviewSocket.js`
  - Added `socketToSession` Map tracking (line ~1094)
  - Added socket tracking on session start (line ~1602)
  - Enhanced `completeInterview` cleanup (lines ~1413-1422)
  - Implemented comprehensive disconnect handler (lines ~1900-1920)

## Testing Approach

### Manual Testing
1. **Normal Flow Test**
   - Start an interview session
   - Complete it normally
   - Verify all Maps are cleaned up
   - Check memory doesn't accumulate

2. **Abrupt Disconnect Test**
   - Start multiple interview sessions
   - Close browser tabs without completing
   - Verify session data is removed from memory
   - Monitor server memory usage

3. **Network Interruption Test**
   - Start interview session
   - Simulate network disconnection
   - Reconnect and verify no memory leaks
   - Check server logs for cleanup messages

4. **Load Test**
   - Run multiple concurrent sessions
   - Randomly disconnect some clients
   - Monitor memory usage over time
   - Verify memory stays stable

### Verification Commands
```bash
# Monitor memory usage during testing
node --expose-gc Backend/index.js

# Check for memory leaks with heap snapshots
node --inspect Backend/index.js
# Then use Chrome DevTools Memory Profiler
```

### Expected Behavior
- ✅ Disconnect logs show session cleanup: "✅ Cleaned up session {sessionId}"
- ✅ Memory usage remains stable over multiple session cycles
- ✅ No orphaned entries in activeSessions, questionTimers, performanceCache
- ✅ Socket-to-session mappings properly removed

## Benefits

1. **Memory Stability**: Server memory usage remains constant regardless of disconnections
2. **Improved Reliability**: Eliminates need for manual server restarts
3. **Better Scalability**: Server can handle more concurrent users
4. **Production Ready**: Prevents crashes in production environments
5. **Resource Efficiency**: Timers and cache entries properly cleaned up
6. **Graceful Degradation**: Handles edge cases and unexpected disconnections

## Monitoring Recommendations

### Add Memory Metrics
Consider adding monitoring for:
- Active session count: `activeSessions.size`
- Active timer count: `questionTimers.size`
- Socket mapping count: `socketToSession.size`
- Memory heap usage: `process.memoryUsage().heapUsed`

### Example Monitoring Endpoint
```javascript
app.get('/api/metrics', (req, res) => {
  res.json({
    activeSessions: activeSessions.size,
    questionTimers: questionTimers.size,
    socketMappings: socketToSession.size,
    memory: process.memoryUsage()
  });
});
```

## Migration Notes

- **Backward Compatible**: No breaking changes to existing API
- **Zero Downtime**: Can be deployed without service interruption
- **No Database Changes**: Only in-memory data structure modifications
- **Client Impact**: None - clients see no behavior changes

## Labels
- `bug`
- `memory-leak`
- `websocket`
- `critical`
- `performance`
- `stability`
