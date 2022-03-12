import moment from "moment";
import { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import { Modal } from "semantic-ui-react";
import events from "../src/utils/events";

let allViews = Object.keys(Views).map((k) => Views[k]);

const localizer = momentLocalizer(moment);

const ModalCalendar = ({ show, onClose, onOpen }) => {
  return (
    <Modal open={show} onClose={onClose} onOpen={onOpen} closeOnEscape>
      <Modal.Header>test</Modal.Header>
    </Modal>
  );
};

const Kalender = () => {
  const [show, setShow] = useState(false);

  const onClose = () => setShow(false);

  const onOpen = () => setShow(true);

  const handleSelectSlot = (event) => {
    console.log(event);
  };
  return (
    <>
      <ModalCalendar
        onClose={onClose}
        onOpen={onOpen}
        show={show}
        setShow={setShow}
      />
      <Calendar
        step={60}
        selectable
        events={events}
        views={["month"]}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={() => setShow(true)}
        defaultView="month"
        scrollToTime={new Date(1970, 1, 1, 6)}
        defaultDate={new Date()}
        localizer={localizer}
      />
    </>
  );
};

export default Kalender;
