
import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import { Label } from "@/components/ui/label";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

interface StripeCardFormProps {
  onChange?: (event: any) => void;
}

export const StripeCardForm: React.FC<StripeCardFormProps> = ({ onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="card-element">Credit or debit card</Label>
        <div className="mt-1 border border-gray-300 rounded-md p-3">
          <CardElement 
            id="card-element"
            options={CARD_ELEMENT_OPTIONS} 
            onChange={onChange}
          />
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        <p>Test card: 4242 4242 4242 4242</p>
        <p>Expiry: Any future date</p>
        <p>CVC: Any 3 digits</p>
        <p>ZIP: Any 5 digits</p>
      </div>
    </div>
  );
};
