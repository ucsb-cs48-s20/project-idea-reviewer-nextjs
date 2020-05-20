import Form from "react-bootstrap/Form";
import { FormControl, Alert } from "react-bootstrap";
import Button from "react-bootstrap/Button";

export default function ReviewForm(props) {
  return (
    <div>
      <h1>Giving Reviews</h1>

      <Alert show={studentRating < 51 || studentRating > 5}></Alert>

      <Alert
        show={ratingDetails.length < 20 || ratingDetails.length > 100}
      ></Alert>

      <h3>Your Review</h3>
      <Form onSubmit="submitReview">
        <Form.Group>
          <Form.Label>
            Rating (enter an integer 1-5, 5 being an incredible idea)
          </Form.Label>
          <FormControl />
          <Form.Label>Details</Form.Label>
          <FormControl
            as="textarea"
            rows="4"
            value={ratingDetails}
            onChange={(e) => setRatingDetails(e.target.value)}
          />
        </Form.Group>
        <Button type="submit">Submit Review</Button>
      </Form>
    </div>
  );
}
