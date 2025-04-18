import React from "react";
import styles from "../styles/Home.module.css";
import { FiCode } from "react-icons/fi";

export default function CodeEditorPreview() {
    return (
        <div className={styles.codeEditorPreview}>
            <div className={styles.editorHeader}>
                <div className={styles.editorControls}>
                    <span className={styles.editorDot}></span>
                    <span className={styles.editorDot}></span>
                    <span className={styles.editorDot}></span>
                </div>
                <div className={styles.editorTabs}>
                    <span className={styles.editorTab}>
                        <FiCode size={12} />
                        <span className={styles.editorFileName}>index.html</span>
                    </span>
                    <span className={styles.editorTab}>
                        <FiCode size={12} />
                        <span className={styles.editorFileName}>style.css</span>
                    </span>
                    <span className={`${styles.editorTab} ${styles.activeTab}`}>
                        <FiCode size={12} />
                        <span className={styles.editorFileName}>main.js</span>
                    </span>
                </div>
            </div>
            <div className={styles.editorBody}>
                <div className={styles.lineNumbers}>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                    <span>7</span>
                    <span>8</span>
                </div>
                <pre className={styles.codeSnippet}>
                    <code>
                        <span className={styles.keyword}>function</span> <span className={styles.function}>createApp</span>
                        () {`{`}
                        <br />
                        &nbsp;&nbsp;<span className={styles.keyword}>const</span> <span className={styles.variable}>app</span> ={" "}
                        <span className={styles.function}>document</span>.<span className={styles.function}>getElementById</span>(
                        <span className={styles.string}>'app'</span>
                        );
                        <br />
                        &nbsp;&nbsp;<span className={styles.comment}>// Render the application</span>
                        <br />
                        &nbsp;&nbsp;<span className={styles.variable}>app</span>.<span className={styles.property}>innerHTML</span> ={" "}
                        <span className={styles.string}>'&lt;h1&gt;Hello CodeXeditor!&lt;/h1&gt;'</span>;
                        <br />
                        &nbsp;&nbsp;<span className={styles.keyword}>return</span> <span className={styles.variable}>app</span>;
                        <br />
                        {`}`}
                        <br />
                        <br />
                        <span className={styles.function}>createApp</span>();
                    </code>
                </pre>
            </div>
        </div>
    );
}
