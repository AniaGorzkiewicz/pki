#include <iostream>
int Policz(int a, int b) {
    return (a+b)*(a-b);
}

int main() {
    std::cout << "W trzecim branchu;  return (2+3)*(2-3)=" << Policz(2,3) << std::endl;
    std::cout << "Hello, World!" << std::endl;
    return 0;
}