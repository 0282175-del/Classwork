/*
    Sieve of Eratosthenes - The sieve of Eratosthenes is one of the most efficient ways
    to find all of the smaller primes (below 10 million or so).
*/

// TODO: Adjust this script so it can work with the sieve.html file.

var sieve = function (n) {
  "use strict";

  var array = [],
    primes = [],
    i,
    j;

  if (typeof n !== "number") {
    n = parseInt(document.getElementById("num").value, 10);
  }

  // TODO: Implement the sieve of eratosthenes algorithm to find all the prime numbers under the given number.
  for (i = 0; i < n; i++) {
    array.push(true);
  }

  for (i = 2; i * i < n; i++) {
    if (array[i]) {
      for (j = i * i; j < n; j += i) {
        array[j] = false;
      }
    }
  }

  for (i = 2; i < n; i++) {
    if (array[i]) {
      primes.push(i);
    }
  }

  if (document.getElementById("primes")) {
    document.getElementById("primes").innerText = primes.join(", ");
  }

  return primes;
};

console.log(sieve(1000000));