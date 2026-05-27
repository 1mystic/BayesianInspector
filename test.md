Here is a new set of real-world test samples for the updated model. These are designed to probe phishing language, obfuscated spam, sports/news ambiguity, health vocabulary, sarcasm, and negation handling.

| Sample Text | Test Domain | Recommended NB Variant | Expected NB Guess | True Target Label |
| --- | --- | --- | --- | --- |
| "Your Microsoft 365 password will expire tonight. Please verify your account through the secure portal to avoid losing access to email and shared files." | **Spam** | **Multinomial** | **Ham** (Corporate/security language can overpower the phishing signal) | **Spam** |
| "You have been selected for a free shipping reward. Cl!ck the l!nk now to claim your g1ft before the offer ends." | **Spam** | **Bernoulli** | **Ham** (Obfuscated tokens may be treated as unknown without normalization) | **Spam** |
| "The city council approved funding for the new stadium after a long debate over parking, transit, and community impact." | **News** | **Multinomial** | **Politics** (Government language can dominate the sports context) | **Sports** |
| "Researchers reported promising results from a clinical trial for a wearable heart monitor that detects irregular rhythms in real time." | **News** | **Multinomial** | **Tech** (Product and engineering language can outweigh the medical context) | **Health** |
| "Fantastic, the train is delayed again and now my connection is gone. What a perfect start to the trip." | **Sentiment** | **Multinomial** | **Positive** (Positive words can mask the complaint tone) | **Negative** |
| "I wouldn't call the movie bad at all, and I do not think it was boring or dull." | **Sentiment** | **Bernoulli** | **Negative** (Naive Bayes often overweights the negative keywords) | **Positive** |
| "Breaking: the company reported quarterly earnings, but the stock fell after executives warned of softer demand in the next quarter." | **News** | **Multinomial** | **Tech / Business** (Corporate language can dominate the intended market-news framing) | **Politics / Business** |
| "The clinic scheduled my follow-up after the surgery, and the doctor said the recovery plan looks good." | **News** | **Multinomial** | **Health** (This should be a clean health/medicine hit) | **Health** |

---

> **Why this happens:** Naive Bayes uses the bag-of-words assumption. It scores documents from token presence and frequency, not sentence structure, negation scope, or sarcasm.

If the model gets some of these wrong, that is useful: the failures show where preprocessing, class coverage, or word weights still need improvement.