import React, { useState, useEffect } from "react";
import { match } from "react-router";
import { debounce } from "lodash";
import styles from "./patient-search.component.css";
import { performPatientSearch } from "./patient-search.resource";
import PatientSearchResults from "./patient-search-result/patient-search-result.component";

export default function PatientSearch(props: PatientSearchProps) {
  const searchTimeout = 400;
  const [searchResults, setSearchResults] = useState([]);
  const [emptyResult, setEmptyResult] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm) {
      performPatientSearch(searchTerm, "full").then(response => {
        const { data } = response;
        setSearchResults(data["results"]);
        if (data["results"].length === 0) {
          setEmptyResult(true);
        } else {
          setEmptyResult(false);
        }
      });
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleChange = debounce(searchTerm => {
    setSearchTerm(searchTerm);
  }, searchTimeout);

  return (
    <div>
      <div className={styles.patientSearchHeader}>
        <button onClick={props.history.goBack} className={styles.iconBtn}>
          <svg className="omrs-icon" fill="var(--omrs-color-interaction)">
            <use xlinkHref="#omrs-icon-arrow-back" />
          </svg>
        </button>
        <input
          className={`omrs-type-title-5 ${styles.patientSearchInput}`}
          placeholder="Search for patient"
          aria-label="search"
          onChange={$event => handleChange($event.target.value)}
          autoFocus
        />
      </div>
      <div className={styles.searchResults}>
        {searchResults.length ? (
          <div>
            <div className={styles.resultsCount}>
              <p>
                <span className={styles.resultsText}>Results:</span>{" "}
                {searchResults.length}{" "}
              </p>
            </div>
            <PatientSearchResults patients={searchResults} />
          </div>
        ) : null}
      </div>
      {!searchResults.length && !emptyResult ? (
        <div className={styles.searchHelper}>
          <p className={`omrs-type-body-regular ${styles.helperText}`}>
            Search by <span className="omrs-bold">patient number</span>
          </p>
          <p className={`omrs-type-body-regular ${styles.helperText}`}>
            If unsuccessful, try patient name
          </p>
        </div>
      ) : null}
      {emptyResult ? (
        <div className={styles.emptyResultContainer}>
          <div className={styles.emptyResultCard}>
            <div className={styles.emptyResultText}>
              Sorry, no patient has been found.
            </div>
            <div className={styles.emptyResultText}>
              Try to search with one of:
              <ul className={styles.dash}>
                <li>patient unique ID number</li>
                <li>patient name(s)</li>
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type PatientSearchProps = {
  match?: match;
  history?: any;
};
