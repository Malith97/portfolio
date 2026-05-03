import React from "react";
import { render, screen } from "@testing-library/react";

import { SectionHeading } from "@/components/section-heading";

describe("SectionHeading", () => {
  it("renders heading content and optional description", () => {
    render(
      <SectionHeading
        label="Case Studies"
        title="Selected Work"
        description="Outcome-focused deliveries."
      />,
    );

    expect(screen.getByText("Case Studies")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Selected Work" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Outcome-focused deliveries.")).toBeInTheDocument();
  });

  it("omits description when not provided", () => {
    render(<SectionHeading label="Experience" title="Work & Education" />);

    expect(screen.getByText("Experience")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Work & Education" }),
    ).toBeInTheDocument();
  });
});
