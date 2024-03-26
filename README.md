# Performance JS

A JavaScript tool to compare the performance difference between different algorithms, functions or versions of the same code.

**How it works ?**

The `CodeRunner` class is used to group the code blocks, then execute them several times, while calculating the average execution time for each one.

## Usage

Import and initialize an instance of the `CodeRunner` class.

```typescript
const { CodeRunner } = require('@shvmerc/performance');
const runner = new CodeRunner();
```

Add the code blocks using the `add` method, you must enter the following parameters.

- **`id`**: Name or ID for the code block, must be unique.
- **`fn`**: The function that contains the code to be executed.

```typescript
runner.add('Method 1', () => {
  const array: number[] = [];
  for (let i = 0; i <= 100; i++) {
    array.push(i);
  }
  return array;
});

runner.add('Method 2', () => {
  const array = Array(101);
  for (let i = 0; i <= 100; i++) {
    array[i] = i;
  }
  return array as number[];
});

runner.add('Method 3', () => {
  return Array.from({ length: 101 }, (_, index) => index);
});

runner.add('Method 4', () => {
  return Array(101).map((_, index) => index);
});

runner.add('Method 5', () => {
  return [...Array(101).keys()];
});
```

Run the comparison using the `run` method and passing the number of repetitions.

_A larger number of repetitions results in a more accurate comparison, but can significantly increase the total duration._

```typescript
const performances = runner.run(100000);
```

Now you can use the results as you wish, but the package includes a simple way to print the results into the console.

First, create a new instance of the `PerformancePrinter` class, you must enter the results directly as the constructor argument.

```typescript
const { PerformancePrinter } = require('@shvmerc/performance');
const printer = new PerformancePrinter(performances);
```

Execute the `print` method to display a comparative graph of the results.

Multiple options are available to configure the output graph.

- **`options.target`:** Displays the percentage difference between the results and the target. By default, the target will be the lowest average result.
- **`options.sort`:** Sort the results, for `'default'` by index and for `'ascending'` or `'descending'` by average time.
- **`options.highlight`:** Highlights selected code blocks in the results.

```typescript
printer.print({
  target: 'Method 4',
  sort: 'ascending',
  highlight: {
    red: 'Method 2',
    green: 'Method 4',
  },
});
```
