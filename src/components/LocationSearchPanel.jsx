import React from 'react';

const LocationSearchPanel = ({
  pickup,
  destination,
  pickupSuggestions,
  destinationSuggestions,
  setPickup,
  setDestination,
  setPanelOpen,
  setVehiclePanel,
  activeField,
  handlePickupChange,
  handleDestinationChange
}) => {
  const suggestions = activeField === 'pickup' ? pickupSuggestions : destinationSuggestions;
  console.log("📜 Suggestions inside panel:", suggestions);

  const handleSuggestionClick = (suggestion) => {
    const selectedText =
      typeof suggestion === 'string'
        ? suggestion
        : suggestion.description || suggestion.display_name || suggestion.name || 'Unnamed';

    if (activeField === 'pickup') {
      setPickup(selectedText);
    } else if (activeField === 'destination') {
      setDestination(selectedText);
    }

    setPanelOpen(false);
    setVehiclePanel(false);
  };

  return (
    <div className="p-4 max-h-[70vh] overflow-y-auto">
      <div className="mb-4 space-y-4">
        <input
          className="bg-gray-100 w-full p-2 rounded"
          type="text"
          value={activeField === 'pickup' ? pickup : destination}
          onChange={activeField === 'pickup' ? handlePickupChange : handleDestinationChange}
          placeholder={`Search ${activeField === 'pickup' ? 'pickup' : 'destination'} location`}
          autoFocus
        />
      </div>

      {!suggestions || suggestions.length === 0 ? (
        <div className="text-center text-gray-500">No suggestions found.</div>
      ) : (
        suggestions.map((item, idx) => {
          const label =
            typeof item === 'string'
              ? item
              : item.description || item.display_name || item.name || 'Unnamed Location';

          return (
            <div
              key={idx}
              onClick={() => handleSuggestionClick(item)}
              className="flex gap-4 border p-3 border-gray-200 hover:border-primary rounded-xl items-center my-2 cursor-pointer transition"
            >
              <div className="bg-lime-100 text-lime-600 h-8 w-8 flex items-center justify-center rounded-full">
                <i className="ri-map-pin-fill"></i>
              </div>
              <h4 className="font-medium text-sm">{label}</h4>
            </div>
          );
        })
      )}
    </div>
  );
};

export default LocationSearchPanel;

