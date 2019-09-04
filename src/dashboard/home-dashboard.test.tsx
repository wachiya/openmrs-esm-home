import React from "react";
import { render, fireEvent } from "@testing-library/react";
import HomeDashboard from "./home-dashboard.component";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

const match = { params: { id: 1 }, isExact: true, path: "", url: "" };
function renderWithRouter(
  ui,
  {
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] })
  } = {}
) {
  return {
    ...render(<Router history={history}>{ui}</Router>),
    history
  };
}
it("renders without failing", () => {
  renderWithRouter(<HomeDashboard match={match} />);
});

it("directs to patient search on click", () => {
  const wrapper = renderWithRouter(<HomeDashboard match={match} />);
  const patientSearchLink = wrapper.getByTestId("patientSearchLink");
  expect(wrapper.history.location.pathname).toEqual("/");
  fireEvent.click(patientSearchLink, { button: 0 });
  expect(wrapper.history.location.pathname).toEqual("/patient-search");
});
