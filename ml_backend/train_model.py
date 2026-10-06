import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
import joblib

# 📂 Load the dataset
df = pd.read_csv("train_data.csv")

# ✅ Input features (X) and target (y)
X = df[["percentage", "maths", "science", "english", "fav_subject", "interest", "goal"]]
y = df["group"]

# 🔍 Identify categorical and numerical columns
categorical_cols = ["fav_subject", "interest", "goal"]
numerical_cols = ["percentage", "maths", "science", "english"]

# ⚙️ Preprocessing pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numerical_cols),
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols)
    ]
)

# 🌲 Random Forest Model pipeline
model = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(
        n_estimators=150,       # number of trees (more = better accuracy)
        random_state=42,        # reproducibility
        max_depth=None,         # let trees grow naturally
        min_samples_split=2,    # minimum samples for a split
        n_jobs=-1               # use all CPU cores for faster training
    ))
])

# ✂️ Split data for training and testing
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 🧠 Train the model
model.fit(X_train, y_train)

# 💾 Save the trained model
joblib.dump(model, "model.joblib")

print("✅ Model trained successfully with Random Forest and saved as model.joblib!")
