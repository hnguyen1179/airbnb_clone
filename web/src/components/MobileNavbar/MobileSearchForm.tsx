import React, { useState } from "react";
import { createPortal } from "react-dom";
import { DateRange, OnDateRangeChangeProps } from "react-date-range";

import { ReactComponent as BackSvg } from "../../assets/icons/back.svg";
import { ReactComponent as SearchSvg } from "../../assets/icons/search.svg";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { disableDay } from "../../utils/disableDays";
import LocationSearch from "../LocationSearch/LocationSearch";
import NumberGuests from "./NumberGuests";

interface Props {
	handleFormClose: (e: React.SyntheticEvent) => void;
}

interface IDate {
	startDate: Date;
	endDate: Date;
	key: string;
}

const MobileSearchForm = ({ handleFormClose }: Props) => {
	const [location, setLocation] = useState("");
	const [dates, setDates] = useState<IDate>({
		startDate: new Date(),
		endDate: new Date(),
		key: "selection",
	});
	const [guests, setGuests] = useState(0);

	const [stage, setStage] = useState("location");

	const handleDateChange = (ranges: OnDateRangeChangeProps) => {
		const start = ranges.selection.startDate as Date;
		const end = ranges.selection.endDate as Date;

		setDates({ ...dates, startDate: start, endDate: end });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// checkIn & checkOut are Date format
		handleFormClose(e);
	};

	const renderNumGuests = () => {
		let string = " ";

		if (guests > 0) {
			string = guests.toString();

			if (guests > 1) {
				string += " guests";
			} else {
				string += " guest";
			}
		}

		return string;
	};

	const renderStage = (page: string) => {
		switch (page) {
			case "location":
				return (
					<div className="MobileSearchForm__form__stage MobileSearchForm__form__stage--location">
						<button
							className="MobileSearchForm__form__stage__back-button"
							type="button"
							onClick={handleFormClose}
						>
							<BackSvg />
						</button>
						<h2 className="MobileSearchForm__form__stage__title">
							Location
						</h2>
						<div className="MobileSearchForm__form__stage__content">
							<LocationSearch
								location={location}
								setLocation={setLocation}
								next={() => setStage("dates")}
							/>
						</div>
					</div>
				);
			case "dates":
				return (
					<div className="MobileSearchForm__form__stage MobileSearchForm__form__stage--dates">
						<button
							className="MobileSearchForm__form__stage__back-button"
							type="button"
							onClick={() => setStage("location")}
						>
							<BackSvg />
						</button>
						<h2 className="MobileSearchForm__form__stage__title">
							Dates
						</h2>
						<div className="MobileSearchForm__form__stage__content">
							<DateRange
								className="date-range date-range--mobile-form"
								months={1}
								direction={"horizontal"}
								showMonthAndYearPickers={true}
								editableDateInputs={true}
								ranges={[dates]}
								rangeColors={["#00a6de"]}
								onChange={handleDateChange}
								disabledDay={disableDay}
							/>
						</div>
						<div className="MobileSearchForm__form__stage__footer">
							<button
								className="MobileSearchForm__form__stage__footer__next-button"
								type="button"
								disabled={(() => {
									const today =
										new Date().toLocaleDateString();
									const start =
										dates.startDate.toLocaleDateString();
									const end =
										dates.endDate.toLocaleDateString();

									return today === start && today === end;
								})()}
								onClick={(e) => {
									e.preventDefault();
									setStage("guests");
								}}
							>
								<span>Next</span>
							</button>
						</div>
					</div>
				);

			case "guests":
				return (
					<div className="MobileSearchForm__form__stage MobileSearchForm__form__stage--guests">
						<button
							className="MobileSearchForm__form__stage__back-button"
							type="button"
							onClick={(e) => {
								e.preventDefault();
								setStage("dates");
							}}
						>
							<BackSvg />
						</button>
						<h2 className="MobileSearchForm__form__stage__title">
							Guests
						</h2>
						<div className="MobileSearchForm__form__stage__content">
							<div className="MobileSearchForm__form__stage__content__location">
								{location}
							</div>
							<div className="MobileSearchForm__form__stage__content__dates">
								{dates.startDate.toLocaleDateString()}
								<span className="spacer">-</span>
								{dates.endDate.toLocaleDateString()}
							</div>
							<div className="MobileSearchForm__form__stage__content__guests">
								<span>{renderNumGuests()}</span>
							</div>
							<NumberGuests
								guests={guests}
								setGuests={setGuests}
							/>
						</div>
						<div className="MobileSearchForm__form__stage__footer">
							<button
								className="MobileSearchForm__form__stage__footer__next-button MobileSearchForm__form__stage__footer__next-button--submit"
								type="submit"
								onClick={handleSubmit}
								disabled={guests < 1 ? true : false}
							>
								<div>
									<SearchSvg />
									<span>Search</span>
								</div>
							</button>
						</div>
					</div>
				);

			default:
				return (
					<div className="MobileSearchForm__form__stage MobileSearchForm__form__stage--location">
						{renderStage(stage)}
					</div>
				);
		}
	};

	return createPortal(
		<div className="MobileSearchForm">
			<form className="MobileSearchForm__form">{renderStage(stage)}</form>
		</div>,
		document?.querySelector("#root") as Element
	);
};

export default MobileSearchForm;