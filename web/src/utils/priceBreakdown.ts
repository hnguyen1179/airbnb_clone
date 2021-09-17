import { formatDistance } from "date-fns";
import { Reservation } from "../generated/graphql";

const occupancyTaxRate: { [region: string]: number } = {
	"San Diego": 0.105,
	"Los Angeles": 0.14,
	"Palm Springs": 0.11,
	"Big Bear": 0.7,
};

const calculateTotal = (reservation: Reservation) => {
	const listing = reservation.listing;
	if (!listing) return {};

	const numNights = parseInt(
		formatDistance(
			new Date(reservation.dateStart),
			new Date(reservation.dateEnd)
		).split(" ")[0]
	);

	const price = listing.price * numNights;
	const cleaningFee = listing.cleaningFee;
	let occupancyTax = 0;

	if (listing.region in occupancyTaxRate) {
		occupancyTax = occupancyTaxRate[listing.region] * (price + cleaningFee);
	}

	const serviceFee = (price + cleaningFee + occupancyTax) * 0.12;

	return {
		totalPrice: +(price + cleaningFee + occupancyTax + serviceFee).toFixed(
			2
		),
		totalNights: numNights,
		price,
		cleaningFee,
		occupancyTax: +occupancyTax.toFixed(2),
		serviceFee: +serviceFee.toFixed(2),
	};
};

export { calculateTotal };