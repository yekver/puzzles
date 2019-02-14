function findDuplicateTransactions (transactions = []) {
    const MIN_ITEMS_LIMIT = 2;

    if (transactions.length < MIN_ITEMS_LIMIT) {
        return [];
    };

    const result = [];
    const transactToGroups = {};
    const MAX_TIME_DIFF = 1 * 60 * 1000; // (1min) in msec
    
    transactions
        .sort((a, b) => new Date(a.time) - new Date(b.time))
        .forEach(transaction => {
            const { sourceAccount, targetAccount, category, amount, time } = transaction;
            const key = [sourceAccount, targetAccount, category, amount].join('#');
            const currTime = new Date(time);

            if (!Array.isArray(transactToGroups[key])) {
                transactToGroups[key] = [];
            }

            const isGroupFound = transactToGroups[key].some(group => {
                let isValid = false;

                if (group.startTime >= currTime && group.endTime < currTime) {
                    isValid = true;
                } else if (currTime <= group.startTime && group.startTime - currTime <= MAX_TIME_DIFF) {
                    isValid = true;
                    group.startTime = currTime;
                } else if (currTime >= group.endTime && currTime - group.endTime <= MAX_TIME_DIFF) {
                    isValid = true;
                    group.endTime = currTime;
                }

                if (isValid) {
                    result[group.id].push(transaction);
                }

                return isValid;
            });

            if (!isGroupFound) {
                const id = result.push([transaction]) - 1;

                transactToGroups[key].push({
                    id, 
                    startTime: currTime,
                    endTime: currTime,
                });
            }
        });
    
    return  result.filter(group => group.length >= MIN_ITEMS_LIMIT);
}


function getBalanceByCategoryInPeriod (transactions = [], category, start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  return transactions.reduce((sum, transaction) => {
      const {time, category: currCategory, amount} = transaction;
      const currDate = new Date(time);
      const isValid = currDate >= startDate && currDate < endDate && currCategory === category;
      
      if (isValid) {
          sum += amount;
      }
      
      return sum;
  }, 0);
}

function maskify (creditCard) {
    const MASK_CHAR = '#';
    const START_POSITION = 1;
    const STOP_POSITION = 4;
    const SKIP_MASKIFY_LIMIT = 6;
    const numbersCount = creditCard.replace(/\D+/g, '').length;
    
    if (numbersCount === 0 || numbersCount < SKIP_MASKIFY_LIMIT) {
        return creditCard;
    }
    
    let maskedString = '';
    const creditCardLength = creditCard.length;

    for(let i = 0; i < creditCardLength; i++) {
        const char = creditCard[i];
        const canMask = i >= START_POSITION && creditCardLength - i > STOP_POSITION && char.match(/^\d$/)

        maskedString += canMask ? MASK_CHAR : creditCard[i];
    }
    
    return maskedString
}

function numberToOrdinal(n) {
    let suffix = '';
    const modByTen = n % 10;
    const modByHundred = n % 100;

    switch (true) {
        case (n === 0):
            break;
        case (modByTen === 1 && modByHundred !== 11):
            suffix = 'st';
            break;
        case (modByTen === 2 && modByHundred !== 12):
            suffix = 'nd';
            break;
        case (modByTen === 3 && modByHundred !== 13):
            suffix = 'rd';
            break;
        default:
            suffix = 'th';
    }

  return n + suffix;
}


function calculateRPN (expression) {
    if (!expression || !expression.length) {
        return 0;
    }

    const OPERATIONS_LIST = ['+', '-', '*', '/'];
    const itemsList = expression.split(' ');
    const stack = [];

    for (let i = 0; i < itemsList.length; i++) {
        const expressionItem = itemsList[i];
        const isOperation = OPERATIONS_LIST.includes(expressionItem);
        let stackItem = expressionItem;

        if (isOperation) {
            const a = Number(stack.pop());
            const b = Number(stack.pop());

            stackItem = eval(`${b} ${expressionItem} ${a}`);
        }
        
        stack.push(stackItem);
    }
    
    return stack.pop();
}
