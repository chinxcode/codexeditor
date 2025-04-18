import React from "react";
import styles from "../styles/Home.module.css";

export default function FeatureCard({ icon, title, description }) {
    return (
        <div className={styles.featureCard}>
            <div className={styles.featureIcon}>{icon}</div>
            <h3 className={styles.featureTitle}>{title}</h3>
            <p className={styles.featureDescription}>{description}</p>
        </div>
    );
}
