import { render, fireEvent, wait, cleanup } from "@testing-library/react";
import React from "react";
import PatientSearch from "./patient-search.component";
import { performPatientSearch } from "./patient-search.resource";
import { debounce } from "lodash";

const mockSearch = performPatientSearch as jest.Mock;
const history = { goBack: () => {} };
const patients = {
  data: {
    results: [
      {
        display: "94004EH: John Doe",
        uuid: "8673ee4f-e2ab-4077-ba55-4980f408773e",
        person: {
          age: 32,
          birthdate: "01-01-2009",
          gender: "M"
        },
        identifiers: [
          {
            identifier: "94004EH",
            identifierType: {
              display: "OpenMRS ID"
            }
          }
        ]
      }
    ]
  }
};

jest.mock("./patient-search.resource", () => ({
  performPatientSearch: jest.fn().mockResolvedValue({
    data: {
      results: []
    }
  })
}));

jest.mock("lodash", () => ({
  debounce: jest.fn(fn => fn)
}));

afterEach(cleanup);

describe("<PatientSearch/>", () => {
  it("renders without failing", () => {
    render(<PatientSearch history={history} />);
  });

  it("triggers search on typing", () => {
    expect(performPatientSearch).not.toHaveBeenCalled();
    const wrapper = render(<PatientSearch history={history} />);
    const searchInput = wrapper.getByLabelText("search");
    fireEvent.change(searchInput, { target: { value: "John" } });
    expect(debounce).toHaveBeenCalled();
    expect(performPatientSearch).toBeCalledTimes(1);
    fireEvent.change(searchInput, { target: { value: "" } });
    expect(performPatientSearch).toBeCalledTimes(1);
  });

  it("renders patient results upon successful search", async () => {
    mockSearch.mockResolvedValue(patients);
    const { container, queryByTestId } = render(
      <PatientSearch history={history} />
    );
    expect(queryByTestId("searchResult")).toBeNull();
    const searchInput = container.querySelector("input");
    fireEvent.change(searchInput, { target: { value: "John" } });
    await wait(() => expect(queryByTestId("searchResult")).not.toBeNull());
  });

  it("renders no patients found message when no patients are found", async () => {
    mockSearch.mockResolvedValue({ data: { results: [] } });
    const { container, getByText } = render(
      <PatientSearch history={history} />
    );
    const searchInput = container.querySelector("input");
    fireEvent.change(searchInput, { target: { value: "John" } });
    await wait(() => expect(getByText(/no patient/i)).not.toBeNull);
  });
});
