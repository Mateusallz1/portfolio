---
title: "Type-safe pattern matching with TypeScript's 'never' type"
pubDate: 2026-03-25
lang: "en"
category: "TypeScript"
tags: ["TypeScript", "TypeSafety", "Patterns"]
---

When handling discriminated unions (e.g., payment status or user roles), use the `never` type to ensure exhaustiveness at compile-time:

```typescript title="payments.ts" ins={16-18}
type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

function handlePayment(status: PaymentStatus) {
  switch (status) {
    case 'pending':
      return 'Processing transaction...';
    case 'succeeded':
      return 'Payment confirmed.';
    case 'failed':
      return 'Payment declined.';
    case 'refunded':
      return 'Amount refunded.';
    default: {
      // If a new status is added to PaymentStatus, TS will fail to build here!
      const _exhaustiveCheck: never = status;
      return _exhaustiveCheck;
    }
  }
}
```
