import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
import joblib

# 1. Load data
df = pd.read_csv("data/combined_dataset.csv")
df = df.dropna(subset=["text", "target"])

X = df["text"]
y = df["target"]

# 2. Train/test split (stratified to keep the same spam/ham ratio in both sets)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 3. Convert text into numeric features (TF-IDF)
vectorizer = TfidfVectorizer(
    lowercase=True,
    stop_words="english",
    max_features=5000,
    ngram_range=(1, 2)  # unigrams + bigrams catch phrases like "act now"
)
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# 4. Train the classifier
model = LogisticRegression(class_weight="balanced", max_iter=1000)
model.fit(X_train_vec, y_train)

# 5. Evaluate
y_pred = model.predict(X_test_vec)
print(classification_report(y_test, y_pred))
print("Confusion matrix:")
print(confusion_matrix(y_test, y_pred))

# 6. Save the trained model + vectorizer (both needed at prediction time)
joblib.dump(model, "scam_classifier.joblib")
joblib.dump(vectorizer, "tfidf_vectorizer.joblib")
print("\nModel and vectorizer saved.")