import { useState } from "react";

export default function AdvancedSearch(): JSX.Element {
  const [included, setIncluded] = useState("");
  const [excluded, setExcluded] = useState("");

  const addIncluded = (event) => {
    event.preventDefault();
    console.log("include ingredient clicked");
  };

  const removeIncluded = (event) => {
    event.preventDefault();
    console.log("include remove ingredient clicked");
  };

  const addExcluded = (event) => {
    event.preventDefault();
    console.log("exclude ingredient clicked");
  };

  const removeExcluded = (event) => {
    event.preventDefault();
    console.log("exclude remove ingredient clicked");
  };

  const savedFilters = (event) => {
    event.preventDefault();
    console.log("saved filters clicked");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          className="advanced-search"
          style={{ width: "8%" }}
          onClick={savedFilters}
        >
          Saved filters
        </button>
      </div>
      <div className="tools">
        <h3>Ingredients</h3>
        <div className="ingredients">
          <div style={{ display: "flex", marginBottom: "1%" }}>
            <input
              type="text"
              id="text"
              name="text"
              value={included}
              placeholder="Included Ingredients"
            />
            <button className="searchbutton" onClick={addIncluded}>
              +
            </button>
            <button className="searchbutton" onClick={removeIncluded}>
              -
            </button>
          </div>
          <div style={{ display: "flex", marginBottom: "1%" }}>
            <input
              type="text"
              id="text"
              name="text"
              value={excluded}
              placeholder="Excluded Ingredients"
            />
            <button className="searchbutton" onClick={addExcluded}>
              +
            </button>
            <button className="searchbutton" onClick={removeExcluded}>
              -
            </button>
          </div>
        </div>
      </div>

      <div className="tools">
        <h3>Tools</h3>
        <div className="ingredients">
          <div style={{ display: "flex", marginBottom: "1%" }}>
            <input
              type="text"
              id="text"
              name="text"
              placeholder="Cooking Tools"
            />
            <button className="searchbutton" onClick={addIncluded}>
              +
            </button>
            <button className="searchbutton" onClick={removeIncluded}>
              -
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="time">Estimated Cooking Time</label>
            <input
              type="range"
              id="time"
              name="time"
              min="0"
              max="100"
              defaultValue={"0"}
              style={{ width: "10%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
