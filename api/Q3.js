export default function handler(req, res) {
  // Tells Vercel to serve this as plain text for MATLAB to read
  res.setHeader('Content-Type', 'text/plain');
  
  res.status(200).send(`
clc
clear 

cost=[2 3 1;
      5 4 8;
      5 6 8];
supply =[20 30 25];
demand=[10 25 40];

[m,n]=size(cost);
alloc =zeros(m,n);
s=supply; d=demand;

while any(s>0) && any(d>0)
    minCost=inf;
    for i=1:m
        for j=1:n
            if s(i)>0 && d(j)>0
                if cost(i,j)<minCost
                    minCost=cost(i,j);
                    row=i; col=j;
                end
            end
        end
    end
    
    x=min(s(row),d(col));
    alloc(row,col)=x;
    s(row)=s(row)-x;
    d(col)=d(col)-x;
end

% Element-wise multiplication (.*) is required here for correct cost!
Total_cost=sum(sum(alloc.*cost));

disp('Allocation Matrix:');
disp(alloc);
disp('Total Cost:');
disp(Total_cost);
  `);
}
