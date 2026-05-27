Here is the breakdown of the test samples, which model variant to test them against, and how a standard Naive Bayes (NB) model is expected to handle them versus what the true correct label should be.

| Sample Text | Test Domain | Recommended NB Variant | Expected NB Guess | True Target Label |
| --- | --- | --- | --- | --- |
| "Hi Team, please review the updated Q3 corporate security policy attached. Human Resources requires all employees to verify their credentials via the internal portal by EOD..." | **Spam** | **Multinomial** (Checks word frequencies) | **Ham** (Overwhelmed by corporate jargon probabilities) | **Spam** (Phishing) |
| "CONGRATULATIONS! You have won a free g!ft c@rd. Claim your pr1ze now at our webs1te." | **Spam** | **Bernoulli** (Checks presence/absence) | **Ham** (If the exact typos `g!ft`/`pr1ze` weren't in training, it treats them as neutral/unknown) | **Spam** |
| "The Department of Justice launched an antitrust investigation into the football league's new broadcasting monopoly, calling for strict federal regulation..." | **News** | **Multinomial** | **Politics / Legal** (High frequency of government/legal terms) | **Sports** |
| "Engineers successfully deployed a new open-source python framework utilizing neural networks... to automate real-time cardiac arrhythmia detection..." | **News** | **Multinomial** | **Tech** (Tech vocabulary heavily outnumbers medical terms) | **Health / Medicine** |
| "Oh, fantastic. Another delayed flight and lost luggage. Truly a spectacular start to my vacation. Love it." | **Sentiment** | **Multinomial or Bernoulli** | **Positive** (Sees "fantastic", "spectacular", "love" as strong positive signals) | **Negative** (Sarcasm) |
| "Do not skip this movie. It is not bad at all, and I wouldn't say it lacks excitement." | **Sentiment** | **Bernoulli** | **Negative** (Flags negative words like "bad" and "lacks" without understanding the negation "not") | **Positive** (Recommendation) |

---

> **Why this happens:** Naive Bayes operates on the "bag-of-words" assumption. It calculates probability based purely on individual token matches, completely ignoring sentence structure, syntax, or word order.

If your model actually passes any of these, it means your training data had some highly specific features that managed to catch these edge cases!