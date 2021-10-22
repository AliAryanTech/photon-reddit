import { loadPage } from "../../support/utils";

const viewportSize = {
	width: -1,
	height: -1
}

describe("Guest only things", () => {
	it("Tutorial", () => {
		cy["clearIdb"]();
		loadPage("/");

		// Has tutorial popup
		cy.get("ph-toast")
			.should("contain.text", "take a quick tour?")
			.find("button.confirmButton ").click();

		cy.get("ph-tutorial").as("tutorial");
		cy.get("ph-tutorial .nextButton").as("nextButton");
		cy.get("ph-tutorial .finishButton").as("finishButton");
		cy.get("ph-tutorial .highlightWindow").as("highlight");

		cy.get("ph-tutorial.isFirst");
		getViewportSize();
		tutorialStep();
	})
})

function tutorialStep() {
	cy.wait(50);
	cy.get("@tutorial").then((tutorial) => {
		// First step
		if (tutorial.hasClass("isFirst")) {
			cy.get("@highlight").should(checkHighlightVisibility(false));
			cy.get("@nextButton").click();
			tutorialStep();
		}
		// Last step
		else if (tutorial.hasClass("isLast")) {
			cy.get("@highlight").should(checkHighlightVisibility(false));
			cy.get("@finishButton").click();
		}
		// normal step
		else {
			cy.get("@highlight").should(checkHighlightVisibility(true));
			cy.get("@nextButton").click();
			tutorialStep();
		}
	})
}

function checkHighlightVisibility(shouldBeVisible: boolean) {
	return (highlight: JQuery) => {
		const rect = highlight.get(0).getBoundingClientRect();
		assert(shouldBeVisible === (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= viewportSize.height &&
			rect.right <= viewportSize.width &&
			rect.width > 0 &&
			rect.height > 0
		));
	};
}

function getViewportSize() {
	viewportSize.width = Cypress.config("viewportWidth");
	viewportSize.height = Cypress.config("viewportHeight");
}