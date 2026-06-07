Lab 3 - Furhat Gestures 

I have created custom gestures, user tracking, an audio expression, and added them into a demonstration dialogue.

Changes

1. Custom Gestures
Shake Head-Gesture: A head shaking movement (turning head left and right) to show disagreement.
Surprise-Gesture: An expression of surprise both eye/brow movement and head tilt.
2. User Tracking
We added (fhAttend) helper which sends a POST request to /furhat/attend.
It accepts target parameters (e.g., "closest" to track the nearest user, or "nobody" to reset attention).
3. Gesture with Audio
It plays an audio file.
The order shown in Terminal by running the command: yarn tsx src/main.ts

Dialogue flow is: (based on the outcome in Terminal)
Start -> Greet -> Surprise -> Shake head -> Anger but with sound -> Goodbye -> Stop 


