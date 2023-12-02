"use strict";(self.webpackChunkrenote=self.webpackChunkrenote||[]).push([[2798],{1169:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>a,default:()=>h,frontMatter:()=>o,metadata:()=>s,toc:()=>d});var i=t(5893),r=t(3905);const o={sidebar_position:3},a="The WebRTC perfect negotiation pattern",s={id:"webrtc/negotiation",title:"The WebRTC perfect negotiation pattern",description:"Introduces WebRTC perfect negotiation, describing how it works and why it's the recommended way to negotiate a WebRTC connection between peers",source:"@site/docs/webrtc/negotiation.mdx",sourceDirName:"webrtc",slug:"/webrtc/negotiation",permalink:"/renote/docs/webrtc/negotiation",draft:!1,unlisted:!1,editUrl:"https://github.com/xREMAGIx/renote/tree/main/docs/webrtc/negotiation.mdx",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"WebRTC Connectivity",permalink:"/renote/docs/webrtc/connectivity"},next:{title:"Demos (TODO)",permalink:"/renote/docs/webrtc/demo"}},c={},d=[{value:"Perfect negotiation concept",id:"perfect-negotiation-concept",level:2},{value:"Implement perfect negotiation",id:"implement-perfect-negotiation",level:2},{value:"Create the signaling and peer connections",id:"create-the-signaling-and-peer-connections",level:3},{value:"Connecting to a remote peer",id:"connecting-to-a-remote-peer",level:3},{value:"Handling incoming tracks",id:"handling-incoming-tracks",level:3},{value:"The perfect negotiation logic",id:"the-perfect-negotiation-logic",level:3},{value:"Handling the negotiationneeded event",id:"handling-the-negotiationneeded-event",level:4},{value:"Handling incoming ICE candidates",id:"handling-incoming-ice-candidates",level:4},{value:"Handling incoming messages on the signaling channel",id:"handling-incoming-messages-on-the-signaling-channel",level:4},{value:"ON RECEIVING A DESCRIPTION",id:"on-receiving-a-description",level:5},{value:"ON RECEIVING AN ICE CANDIDATE",id:"on-receiving-an-ice-candidate",level:5},{value:"Making perfect negotiation",id:"making-perfect-negotiation",level:2},{value:"Glare-free setLocalDescription()",id:"glare-free-setlocaldescription",level:3},{value:"Automatic rollback in setRemoteDescription()",id:"automatic-rollback-in-setremotedescription",level:3},{value:"ON RECEIVING A DESCRIPTION",id:"on-receiving-a-description-1",level:5},{value:"ON RECEIVING AN ICE CANDIDATE",id:"on-receiving-an-ice-candidate-1",level:5},{value:"Explicit restartIce() method added",id:"explicit-restartice-method-added",level:3}];function l(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.ah)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"the-webrtc-perfect-negotiation-pattern",children:"The WebRTC perfect negotiation pattern"}),"\n",(0,i.jsx)(n.p,{children:"Introduces WebRTC perfect negotiation, describing how it works and why it's the recommended way to negotiate a WebRTC connection between peers"}),"\n",(0,i.jsx)(n.admonition,{type:"info",children:(0,i.jsxs)(n.p,{children:["Resource: ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation",children:"Establishing a connection: The WebRTC perfect negotiation pattern - MDN"})]})}),"\n",(0,i.jsx)(n.h2,{id:"perfect-negotiation-concept",children:"Perfect negotiation concept"}),"\n",(0,i.jsx)(n.p,{children:"The best thing about perfect negotiation is that the same code is used for both the caller and the callee, so there's no repetition or otherwise added levels of negotiation code to write."}),"\n",(0,i.jsx)(n.p,{children:"Perfect negotiation works by assigning each of the two peers a role to play in the negotiation process that's entirely separate from the WebRTC connection state:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["A ",(0,i.jsx)(n.strong,{children:(0,i.jsx)(n.em,{children:"polite peer"})}),', which uses ICE rollback to prevent collisions with incoming offers. A polite peer, essentially, is one which may send out offers, but then responds if an offer arrives from the other peer with "Okay, never mind, drop my offer and I\'ll consider yours instead."']}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["An ",(0,i.jsx)(n.strong,{children:(0,i.jsx)(n.em,{children:"impolite peer"})}),", which always ignores incoming offers that collide with its own offers. It never apologizes or gives up anything to the polite peer. Any time a collision occurs, the impolite peer wins."]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"This way, both peers know exactly what should happen if there are collisions between offers that have been sent. Responses to error conditions become far more predictable."}),"\n",(0,i.jsx)(n.admonition,{type:"note",children:(0,i.jsx)(n.p,{children:"The roles of caller and callee can switch during perfect negotiation. If the polite peer is the caller and it sends an offer but there's a collision with the impolite peer, the polite peer drops its offer and instead replies to the offer it has received from the impolite peer. By doing so, the polite peer has switched from being the caller to the callee!"})}),"\n",(0,i.jsx)(n.h2,{id:"implement-perfect-negotiation",children:"Implement perfect negotiation"}),"\n",(0,i.jsxs)(n.p,{children:["Assumes that there's a ",(0,i.jsx)(n.code,{children:"SignalingChannel"})," class defined that is used to communicate with the signaling server."]}),"\n",(0,i.jsx)(n.h3,{id:"create-the-signaling-and-peer-connections",children:"Create the signaling and peer connections"}),"\n",(0,i.jsxs)(n.p,{children:["First, the signaling channel needs to be opened and the ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection",children:(0,i.jsx)(n.code,{children:"RTCPeerConnection"})})," needs to be created."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",children:'const config = {\n  iceServers: [{ urls: "stun:stun.mystunserver.tld" }],\n};\n\nconst signaler = new SignalingChannel();\nconst pc = new RTCPeerConnection(config);\n'})}),"\n",(0,i.jsx)(n.h3,{id:"connecting-to-a-remote-peer",children:"Connecting to a remote peer"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",children:'const constraints = { audio: true, video: true };\nconst selfVideo = document.querySelector("video.selfview");\nconst remoteVideo = document.querySelector("video.remoteview");\n\nasync function start() {\n  try {\n    const stream = await navigator.mediaDevices.getUserMedia(constraints);\n\n    for (const track of stream.getTracks()) {\n      pc.addTrack(track, stream);\n    }\n    selfVideo.srcObject = stream;\n  } catch (err) {\n    console.error(err);\n  }\n}\n'})}),"\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.code,{children:"start()"})," function shown above can be called by either of the two end-points that want to talk to one another. It doesn't matter who does it first; the negotiation will just work."]}),"\n",(0,i.jsxs)(n.p,{children:["The user's camera and microphone are obtained by calling ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia",title:"getUserMedia()",children:(0,i.jsx)(n.code,{children:"getUserMedia()"})}),"."]}),"\n",(0,i.jsxs)(n.p,{children:["The resulting media tracks are then added to the ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection",children:(0,i.jsx)(n.code,{children:"RTCPeerConnection"})})," by passing them into ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addTrack",title:"addTrack()",children:(0,i.jsx)(n.code,{children:"addTrack()"})}),"."]}),"\n",(0,i.jsxs)(n.p,{children:["Then, finally, the media source for the self-view ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video",children:(0,i.jsx)(n.code,{children:"<video>"})})," element indicated by the ",(0,i.jsx)(n.code,{children:"selfVideo"})," constant is set to the camera and microphone stream, allowing the local user to see what the other peer sees."]}),"\n",(0,i.jsx)(n.h3,{id:"handling-incoming-tracks",children:"Handling incoming tracks"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",children:"pc.ontrack = ({ track, streams }) => {\n  track.onunmute = () => {\n    if (remoteVideo.srcObject) {\n      return;\n    }\n    remoteVideo.srcObject = streams[0];\n  };\n};\n"})}),"\n",(0,i.jsxs)(n.p,{children:["When the ",(0,i.jsx)(n.code,{children:"track"})," event occurs, this handler executes. Extract ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/RTCTrackEvent/track",title:"track",children:(0,i.jsx)(n.code,{children:"track"})})," and ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/RTCTrackEvent/streams",title:"streams",children:(0,i.jsx)(n.code,{children:"streams"})})," properties from the ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/RTCTrackEvent",children:(0,i.jsx)(n.code,{children:"RTCTrackEvent"})}),"."]}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.em,{children:(0,i.jsx)(n.code,{children:"track"})})," is either the video track or the audio track being received."]}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.em,{children:(0,i.jsx)(n.code,{children:"streams"})})," is an array of ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/MediaStream",children:(0,i.jsx)(n.code,{children:"MediaStream"})})," objects, each representing a stream containing this track (a track may in rare cases belong to multiple streams at once)."]}),"\n",(0,i.jsxs)(n.p,{children:["In our case, this will always contain one stream, at index 0, because we passed one stream into ",(0,i.jsx)(n.code,{children:"addTrack()"})," earlier."]}),"\n",(0,i.jsx)(n.p,{children:"We add an unmute event handler to the track, because the track will become unmuted once it starts receiving packets."}),"\n",(0,i.jsxs)(n.p,{children:["If we already have video coming in from the remote peer (which we can see if the remote view's ",(0,i.jsx)(n.code,{children:"<video>"})," element's ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject",title:"srcObject",children:(0,i.jsx)(n.code,{children:"srcObject"})})," property already has a value), we do nothing. Otherwise, we set ",(0,i.jsx)(n.code,{children:"srcObject"})," to the stream at index 0 in the ",(0,i.jsx)(n.code,{children:"streams"})," array."]}),"\n",(0,i.jsx)(n.h3,{id:"the-perfect-negotiation-logic",children:"The perfect negotiation logic"}),"\n",(0,i.jsx)(n.p,{children:"Now we get into the true perfect negotiation logic, which functions entirely independently from the rest of the application."}),"\n",(0,i.jsx)(n.h4,{id:"handling-the-negotiationneeded-event",children:"Handling the negotiationneeded event"}),"\n",(0,i.jsxs)(n.p,{children:["First, we implement the ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection",children:(0,i.jsx)(n.code,{children:"RTCPeerConnection"})})," event handler ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/negotiationneeded_event",title:"onnegotiationneeded",children:(0,i.jsx)(n.code,{children:"onnegotiationneeded"})})," to get a local description and send it using the signaling channel to the remote peer."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",children:"let makingOffer = false;\n\npc.onnegotiationneeded = async () => {\n  try {\n    makingOffer = true;\n    await pc.setLocalDescription();\n    signaler.send({ description: pc.localDescription });\n  } catch (err) {\n    console.error(err);\n  } finally {\n    makingOffer = false;\n  }\n};\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Note that ",(0,i.jsx)(n.code,{children:"setLocalDescription()"})," without arguments automatically creates and sets the appropriate description based on the current ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/signalingState",title:"signalingState",children:(0,i.jsx)(n.code,{children:"signalingState"})}),". The set description is either an answer to the most recent offer from the remote peer ",(0,i.jsx)(n.em,{children:"or"})," a freshly-created offer if there's no negotiation underway. Here, it will always be an ",(0,i.jsx)(n.code,{children:"offer"}),", because the negotiationneeded event is only fired in ",(0,i.jsx)(n.code,{children:"stable"})," state."]}),"\n",(0,i.jsxs)(n.p,{children:["We set a Boolean variable, ",(0,i.jsx)(n.code,{children:"makingOffer"})," to ",(0,i.jsx)(n.code,{children:"true"})," to mark that we're preparing an offer. To avoid races, we'll use this value later instead of the signaling state to determine whether or not an offer is being processed because the value of ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/signalingState",title:"signalingState",children:(0,i.jsx)(n.code,{children:"signalingState"})})," changes asynchronously, introducing a glare opportunity."]}),"\n",(0,i.jsx)(n.p,{children:"Once the offer has been created, set and sent (or an error occurs), makingOffer gets set back to false."}),"\n",(0,i.jsx)(n.h4,{id:"handling-incoming-ice-candidates",children:"Handling incoming ICE candidates"}),"\n",(0,i.jsxs)(n.p,{children:["Next, we need to handle the ",(0,i.jsx)(n.code,{children:"RTCPeerConnection"})," event ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/icecandidate_event",title:"icecandidate",children:(0,i.jsx)(n.code,{children:"icecandidate"})}),", which is how the local ICE layer passes candidates to us for delivery to the remote peer over the signaling channel."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",children:"pc.onicecandidate = ({ candidate }) => signaler.send({ candidate });\n"})}),"\n",(0,i.jsxs)(n.p,{children:["This takes the ",(0,i.jsx)(n.code,{children:"candidate"})," member of this ICE event and passes it through to the signaling channel's ",(0,i.jsx)(n.code,{children:"send()"})," method to be sent over the signaling server to the remote peer."]}),"\n",(0,i.jsx)(n.h4,{id:"handling-incoming-messages-on-the-signaling-channel",children:"Handling incoming messages on the signaling channel"}),"\n",(0,i.jsxs)(n.p,{children:["That's implemented here as an ",(0,i.jsx)(n.code,{children:"onmessage"})," event handler on the signaling channel object. This method is invoked each time a message arrives from the signaling server."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",children:'let ignoreOffer = false;\n\nsignaler.onmessage = async ({ data: { description, candidate } }) => {\n  try {\n    if (description) {\n      const offerCollision =\n        description.type === "offer" &&\n        (makingOffer || pc.signalingState !== "stable");\n\n      ignoreOffer = !polite && offerCollision;\n      if (ignoreOffer) {\n        return;\n      }\n\n      await pc.setRemoteDescription(description);\n      if (description.type === "offer") {\n        await pc.setLocalDescription();\n        signaler.send({ description: pc.localDescription });\n      }\n    } else if (candidate) {\n      try {\n        await pc.addIceCandidate(candidate);\n      } catch (err) {\n        if (!ignoreOffer) {\n          throw err;\n        }\n      }\n    }\n  } catch (err) {\n    console.error(err);\n  }\n};\n'})}),"\n",(0,i.jsxs)(n.p,{children:["Upon receiving an incoming message from the ",(0,i.jsx)(n.code,{children:"SignalingChannel"})," through its ",(0,i.jsx)(n.code,{children:"onmessage"})," event handler, the received JSON object is destructured to obtain the ",(0,i.jsx)(n.code,{children:"description"})," or ",(0,i.jsx)(n.code,{children:"candidate"})," found within. If the incoming message has a ",(0,i.jsx)(n.code,{children:"description"}),", it's either an offer or an answer sent by the other peer."]}),"\n",(0,i.jsxs)(n.p,{children:["If, on the other hand, the message has a ",(0,i.jsx)(n.code,{children:"candidate"}),", it's an ICE candidate received from the remote peer as part of ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/canTrickleIceCandidates",children:"trickle ICE"}),". The candidate is destined to be delivered to the local ICE layer by passing it into ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addIceCandidate",title:"addIceCandidate()",children:(0,i.jsx)(n.code,{children:"addIceCandidate()"})}),"."]}),"\n",(0,i.jsx)(n.h5,{id:"on-receiving-a-description",children:"ON RECEIVING A DESCRIPTION"}),"\n",(0,i.jsxs)(n.p,{children:["If we received a ",(0,i.jsx)(n.code,{children:"description"}),", we prepare to respond to the incoming offer or answer. First, we check to make sure we're in a state in which we can accept an offer. If the connection's signaling state isn't ",(0,i.jsx)(n.code,{children:"stable"})," or if our end of the connection has started the process of making its own offer, then we need to look out for offer collision."]}),"\n",(0,i.jsxs)(n.p,{children:["If we're the ",(0,i.jsx)(n.strong,{children:(0,i.jsx)(n.em,{children:"impolite peer"})}),", and we're receiving a colliding offer, we return without setting the description, and instead set ",(0,i.jsx)(n.code,{children:"ignoreOffer"})," to ",(0,i.jsx)(n.code,{children:"true"})," to ensure we also ignore all candidates the other side may be sending us on the signaling channel belonging to this offer. Doing so avoids error noise since we never informed our side about this offer."]}),"\n",(0,i.jsxs)(n.p,{children:["If we're the ",(0,i.jsx)(n.strong,{children:(0,i.jsx)(n.em,{children:"polite peer"})}),", and we're receiving a colliding offer, we don't need to do anything special, because our existing offer will automatically be rolled back in the next step."]}),"\n",(0,i.jsxs)(n.p,{children:["Having ensured that we want to accept the offer, we set the remote description to the incoming offer by calling ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/setRemoteDescription",title:"setRemoteDescription()",children:(0,i.jsx)(n.code,{children:"setRemoteDescription()"})}),". This lets WebRTC know what the proposed configuration of the other peer is. If we're the polite peer, we will drop our offer and accept the new one."]}),"\n",(0,i.jsxs)(n.p,{children:["If the newly-set remote description is an offer, we ask WebRTC to select an appropriate local configuration by calling the ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection",children:(0,i.jsx)(n.code,{children:"RTCPeerConnection"})})," method ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/setLocalDescription",title:"setLocalDescription()",children:(0,i.jsx)(n.code,{children:"setLocalDescription()"})})," without parameters. This causes ",(0,i.jsx)(n.code,{children:"setLocalDescription()"})," to automatically generate an appropriate answer in response to the received offer. Then we send the answer through the signaling channel back to the first peer."]}),"\n",(0,i.jsx)(n.h5,{id:"on-receiving-an-ice-candidate",children:"ON RECEIVING AN ICE CANDIDATE"}),"\n",(0,i.jsxs)(n.p,{children:["On the other hand, if the received message contains an ICE candidate, we deliver it to the local ",(0,i.jsx)(n.a,{href:"/docs/webrtc/protocols#ice---interactive-connectivity-establishment",children:(0,i.jsx)(n.strong,{children:"ICE"})})," layer by calling the ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection",children:(0,i.jsx)(n.code,{children:"RTCPeerConnection"})})," method ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addIceCandidate",title:"addIceCandidate()",children:(0,i.jsx)(n.code,{children:"addIceCandidate()"})}),". If an error occurs and we've ignored the most recent offer, we also ignore any error that may occur when trying to add the candidate."]}),"\n",(0,i.jsx)(n.h2,{id:"making-perfect-negotiation",children:"Making perfect negotiation"}),"\n",(0,i.jsxs)(n.admonition,{type:"info",children:[(0,i.jsxs)(n.p,{children:["For more information, please visit ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation",children:"Establishing a connection: The WebRTC perfect negotiation pattern - MDN"})," to deep dive and see old API implement vs. updated API implement for more understanding."]}),(0,i.jsx)(n.p,{children:"In here, I just note updated API implementation"})]}),"\n",(0,i.jsx)(n.h3,{id:"glare-free-setlocaldescription",children:"Glare-free setLocalDescription()"}),"\n",(0,i.jsxs)(n.p,{children:["In the past, the ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/negotiationneeded_event",title:"negotiationneeded",children:(0,i.jsx)(n.code,{children:"negotiationneeded"})})," event was easily handled in a way that was susceptible to glare---that is, it was prone to collisions, where both peers could wind up attempting to make an offer at the same time, leading to one or the other peers getting an error and aborting the connection attempt."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",children:"let makingOffer = false;\n\npc.onnegotiationneeded = async () => {\n  try {\n    makingOffer = true;\n    await pc.setLocalDescription();\n    signaler.send({ description: pc.localDescription });\n  } catch (err) {\n    console.error(err);\n  } finally {\n    makingOffer = false;\n  }\n};\n"})}),"\n",(0,i.jsxs)(n.p,{children:["We set ",(0,i.jsx)(n.code,{children:"makingOffer"})," immediately before calling ",(0,i.jsx)(n.code,{children:"setLocalDescription()"})," in order to lock against interfering with sending this offer, and we don't clear it back to ",(0,i.jsx)(n.code,{children:"false"})," until the offer has been sent to the signaling server (or an error has occurred, preventing the offer from being made)."]}),"\n",(0,i.jsx)(n.p,{children:"This way, we avoid the risk of offers colliding."}),"\n",(0,i.jsx)(n.h3,{id:"automatic-rollback-in-setremotedescription",children:"Automatic rollback in setRemoteDescription()"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",children:'let ignoreOffer = false;\n\nsignaler.onmessage = async ({ data: { description, candidate } }) => {\n  try {\n    if (description) {\n      const offerCollision =\n        description.type === "offer" &&\n        (makingOffer || pc.signalingState !== "stable");\n\n      ignoreOffer = !polite && offerCollision;\n      if (ignoreOffer) {\n        return;\n      }\n\n      await pc.setRemoteDescription(description);\n      if (description.type === "offer") {\n        await pc.setLocalDescription();\n        signaler.send({ description: pc.localDescription });\n      }\n    } else if (candidate) {\n      try {\n        await pc.addIceCandidate(candidate);\n      } catch (err) {\n        if (!ignoreOffer) {\n          throw err;\n        }\n      }\n    }\n  } catch (err) {\n    console.error(err);\n  }\n};\n'})}),"\n",(0,i.jsx)(n.h5,{id:"on-receiving-a-description-1",children:"ON RECEIVING A DESCRIPTION"}),"\n",(0,i.jsxs)(n.p,{children:["In the revised code, if the received message is an SDP ",(0,i.jsx)(n.code,{children:"description"}),", we check to see if it arrived while we're attempting to transmit an offer. If the received message is an ",(0,i.jsx)(n.code,{children:"offer"})," ",(0,i.jsx)(n.em,{children:"and"})," the local peer is the impolite peer, ",(0,i.jsx)(n.em,{children:"and"})," a collision is occurring, we ignore the offer because we want to continue to try to use the offer that's already in the process of being sent. That's the impolite peer in action."]}),"\n",(0,i.jsxs)(n.p,{children:["In any other case, we'll try instead to handle the incoming message. This begins by setting the remote description to the received ",(0,i.jsx)(n.code,{children:"description"})," by passing it into ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/setRemoteDescription",title:"setRemoteDescription()",children:(0,i.jsx)(n.code,{children:"setRemoteDescription()"})}),". This works regardless of whether we're handling an offer or an answer since rollback will be performed automatically as needed."]}),"\n",(0,i.jsxs)(n.p,{children:["At that point, if the received message is an ",(0,i.jsx)(n.code,{children:"offer"}),", we use ",(0,i.jsx)(n.code,{children:"setLocalDescription()"})," to create and set an appropriate local description, then we send it to the remote peer over the signaling server."]}),"\n",(0,i.jsx)(n.h5,{id:"on-receiving-an-ice-candidate-1",children:"ON RECEIVING AN ICE CANDIDATE"}),"\n",(0,i.jsxs)(n.p,{children:["On the other hand, if the received message is an ICE candidate---indicated by the JSON object containing a ",(0,i.jsx)(n.code,{children:"candidate"})," member---we deliver it to the local ICE layer by calling the ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection",children:(0,i.jsx)(n.code,{children:"RTCPeerConnection"})}),"method ",(0,i.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addIceCandidate",title:"addIceCandidate()",children:(0,i.jsx)(n.code,{children:"addIceCandidate()"})}),". Errors are, as before, ignored if we have just discarded an offer."]}),"\n",(0,i.jsx)(n.h3,{id:"explicit-restartice-method-added",children:"Explicit restartIce() method added"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",children:'let makingOffer = false;\n\npc.onnegotiationneeded = async () => {\n  try {\n    makingOffer = true;\n    await pc.setLocalDescription();\n    signaler.send({ description: pc.localDescription });\n  } catch (err) {\n    console.error(err);\n  } finally {\n    makingOffer = false;\n  }\n};\npc.oniceconnectionstatechange = () => {\n  if (pc.iceConnectionState === "failed") {\n    pc.restartIce();\n  }\n};\n'})}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"restartIce()"})," tells the ICE layer to automatically add the ",(0,i.jsx)(n.code,{children:"iceRestart"})," flag to the next ICE message sent."]})]})}function h(e={}){const{wrapper:n}={...(0,r.ah)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},3905:(e,n,t)=>{t.d(n,{ah:()=>d});var i=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);n&&(i=i.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,i)}return t}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,i,r=function(e,n){if(null==e)return{};var t,i,r={},o=Object.keys(e);for(i=0;i<o.length;i++)t=o[i],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(i=0;i<o.length;i++)t=o[i],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var c=i.createContext({}),d=function(e){var n=i.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):a(a({},n),e)),t},l={inlineCode:"code",wrapper:function(e){var n=e.children;return i.createElement(i.Fragment,{},n)}},h=i.forwardRef((function(e,n){var t=e.components,r=e.mdxType,o=e.originalType,c=e.parentName,h=s(e,["components","mdxType","originalType","parentName"]),p=d(t),g=r,f=p["".concat(c,".").concat(g)]||p[g]||l[g]||o;return t?i.createElement(f,a(a({ref:n},h),{},{components:t})):i.createElement(f,a({ref:n},h))}));h.displayName="MDXCreateElement"}}]);