import React from "react";
import styles from "./patient-search-result.component.css";
import dayjs from "dayjs";

export default function PatientSearchResults(props: PatientSearchResultsProps) {
  return props.patients.map((patient, index) =>
    renderPatient(patient, index + 1)
  );

  function renderPatient(patient, resultNumber) {
    const preferredIdentifier =
      patient.identifiers.find(i => i.preferred) || patient.identifiers[0];

    return (
      <div
        key={patient.display}
        className={styles.patientResult}
        data-testid="searchResult"
      >
        <span className={styles.resultNumber}>{resultNumber}</span>
        <div className={styles.patientCard}>
          <div className={styles.patientNameContainer}>
            <span className={styles.patientName}>{patient.person.display}</span>
            <button className="omrs-unstyled">
              <svg className="omrs-icon" fill="var(--omrs-color-interaction)">
                <use xlinkHref="#omrs-icon-chevron-right"></use>
              </svg>
            </button>
          </div>
          <div className={styles.patientDetailsContainer}>
            <div className={styles.tile}>
              <div className={styles.patientData}>{patient.person.gender}</div>
            </div>
            <div className={styles.tile}>
              <div className={styles.patientData}>{patient.person.age}</div>
              <div className={styles.patientDataLabel}>years</div>
            </div>
            <div className={styles.tile}>
              <div className={styles.patientData}>
                {dayjs(patient.person.birthdate).format("DD-MMM-YYYY")}
              </div>
              <div className={styles.patientDataLabel}>birth date</div>
            </div>
            <div className={styles.tile}>
              <div className={styles.patientData}>
                {preferredIdentifier.identifier}
              </div>
              <div className={styles.patientDataLabel}>
                {preferredIdentifier.identifierType.display}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

type PatientSearchResultsProps = {
  patients: any;
};
