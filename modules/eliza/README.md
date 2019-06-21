Eliza adds a psychotherapist as Flow Node to Cognigy.AI. This Custom Module is based on [**Elizabot.js**](https://www.masswerk.at/elizabot/).

This is how the creator of Eliza, Joseph Weizenbaum, discussed his choice for a conversation model as it would be found in psychotherapist's session:

> At this writing, the only serious ELIZA scripts which exist are some which cause ELIZA to respond roughly as would certain psychotherapists (Rogerians). ELIZA performs best when its human correspondent is initially instructed to "talk" to it, via the typewriter of course, just as one would to a psychiatrist. This mode of conversation was chosen because the psychiatric interview is one of the few examples of categorized dyadic natural language communication in which one of the participating pair is free to assume the pose of knowing almost nothing of the real world. If, for example, one were to tell a psychiatrist "I went for a long boat ride" and he responded "Tell me about boats", one would not assume that he knew nothing about boats, but that he had some purpose in so directing the subsequent conversation. It is important to note that this assumption is one made by the speaker. Whether it is realistic or not is an altogether separate question. In any case, it has a crucial psychological utility in that it serves the speaker to maintain his sense of being heard and understood. The speaker further defends his impression (which even in real life may be illusory) by attributing to his conversational partner all sorts of background knowledge, insights and reasoning ability. But again, these are the speaker's contribution to the conversation. (http://www.universelle-automation.de/1966_Boston.pdf)

## Node: translate

Takes the current input and translates it into a reply to keep the conversation alive.

The result and Eliza's memory will be stored in the Cognigy context (`cc.STORE`) using the store name given in the node's settings.

Further details are explained on the **Elizabot.js** sample website [documentation](https://www.masswerk.at/elizabot/).