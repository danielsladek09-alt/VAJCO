export type SlotWithAvailability = {
  id: string;
  pickupLocationId: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  booked: number;
  remaining: number;
};
